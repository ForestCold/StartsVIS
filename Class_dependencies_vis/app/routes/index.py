import json
import os

from app import app
from flask import Flask, request

debug = False
source = []
nodes = []
links = []
nodes_set = []

data = {}
tests = []
jdes = []
classes = []

fathers = {}
children = {}
node_id_map = {}
id_node_map = {}
remove_nodes = []

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/list')
def _list():
	datalist = [name for name in os.listdir("app/data")]

	if ".DS_Store" in datalist:
		datalist.remove(".DS_Store")

	return json.dumps(datalist)

@app.route('/group/<group_id>')
def _group_filter(group_id):

	gid = group_id.split(",")

	data = {}
	data["source"] = source
	data["graph"] = {
		"nodes" : node_filter(gid, "group"),
		"links" : link_filter()
	}

	return json.dumps(data)

@app.route('/type/<type_id>')
def _type_filter(type_id):

	tid = type_id.split(",")

	data = {}
	data["source"] = source
	data["graph"] = {
		"nodes" : node_filter(tid, "type"),
		"links" : link_filter()
	}

	return json.dumps(data)

#load data
@app.route('/data/<dataname>')
def _load(dataname):

	fgraph = 'app/data/' + dataname + '/' + "graph.txt"
	ftest = 'app/data/' + dataname + '/' + "all-tests"
	fjdes = 'app/data/' + dataname + '/' + "jdeps-out"

	load_tests(ftest)
	load_jdes(fjdes)
	load_graph(fgraph)

	return json.dumps(data)

def load_graph(fpath):

	# change dataset, init paras
	global node_id_map
	global id_node_map
	global fathers
	global children
	global nodes_set
	global nodes
	global links
	global source
	global data

	fathers = {}
	children = {}
	node_id_map = {}
	id_node_map = {}
	nodes_set = []
	source = []
	nodes = []
	links = []

	# open file, define nodes, links, source
	with open(fpath) as f:
		for line in f.readlines():
			link = {}
			row = {}
			link['source'] = line.split()[0]
			row['source'] = line.split()[0]
			link['target'] = line.split()[1]
			row['target'] = line.split()[1]
			link['value'] = 1
			link['type'] = "real"
			links.append(link)
			source.append(row)
			nodes.append(link['source'])
			nodes.append(link['target'])

	exist = 0
	for node in nodes:
		for node_info in nodes_set:
			if node_info["value"] == node:
				node_info["size"] += 2
				exist = 1
				break
		if exist == 0:
			node_info = {}
			node_id_map[node] = len(nodes_set)
			node_info["id"] = len(nodes_set)
			node_info["value"] = node
			node_info["size"] = 2
			node_info["group"] = cal_group(node)
			node_info["type"] = cal_type(node)
			nodes_set.append(node_info)
		exist = 0

	index = 0
	for link in links:
		link['source'] = node_id_map[link['source']]
		link['target'] = node_id_map[link['target']]
		link['id'] = index
		index += 1

	for index in node_id_map:
		id_node_map[node_id_map[index]] = index
		fathers[node_id_map[index]] = []
		children[node_id_map[index]] = []

	for record in source:
		fathers[node_id_map[record["source"]]].append(node_id_map[record["target"]])
		children[node_id_map[record["target"]]].append(node_id_map[record["source"]])

	for node in nodes_set:
		node["fathers"] = fathers[node["id"]]
		node["children"] = children[node["id"]]

	data["source"] = source
	data["graph"] = {
		"links" : links,
		"nodes" : nodes_set
	}

def load_tests(fpath):
	with open(fpath) as f:
		for line in f.readlines():
			tests.append(line.strip('\n'))
	return

def load_jdes(fpath):
	with open(fpath) as f:
		for line in f.readlines():
			jdes.append(line.strip('\n'))
			classes.append(line.split(',')[0])
	return

# private function

def node_filter(id, para):

	global remove_nodes
	cur_nodes = []
	remove_nodes = []

	for node in nodes_set:
		if para == "group":
			candidate = node["group"]["id"]
		elif para == "type":
			candidate = node["type"]
		if unicode(candidate) in id:
			cur_nodes.append(node)
		else:
			remove_nodes.append(node["id"])

	return cur_nodes

def link_filter():

	global remove_nodes
	remove_links = []
	cur_links = []
	n = -1

	for link in links:

		if link["source"] in remove_nodes:
			n = link["source"]
			remove_links.append(link)

		if link["target"] in remove_nodes:
			n = link["target"]
			remove_links.append(link)

		if n >= 0 and fathers[n]:
			for father in fathers[n]:
				if father not in remove_nodes:
					for child in children[n]:
						if child not in remove_nodes:
							link = {
								"source": father,
								"target": child,
								"value": 1,
								"type": "virtual"
								}
							if link not in cur_links:
								cur_links.append(link)

	for link in links:
		if link not in remove_links:
			if link not in cur_links:
				cur_links.append(link)

	index = 0
	for link in cur_links:
		link["id"] = index
		index += 1

	return cur_links

def cal_type(node):

	if node in tests:
		return "test"

	if node in classes:
		return "class"

	return "library"


def cal_group(node):

	id = 16
	name = "others"

	if node.find("junit.internal") > -1:
		id = 1
		name = "junit.internal"
	if node.find("io") > -1:
		id = 2
		name = "java.io"
	if node.find("hamcrest") > -1:
		id = 3
		name = "hamcrest"
	if node.find("util") > -1:
		id = 4
		name = "java.util"
	if node.find("servlet") > -1:
		id = 5
		name = "servlet"
	if node.find("portlet") > -1:
		id = 6
		name = "portlet"
	if node.find("junit.runner") > -1:
		id = 7
		name = "junit.runner"
	if node.find("junit.experimental") > -1:
		id = 8
		name = "org.junit.experimental"
	if node.find("junit.validator") > -1:
		id = 9
		name = "org.junit.validator"
	if node.find("junit.framework") > -1:
		id = 10
		name = "org.junit.framework"
	if node.find("junit.Assume") > -1:
		id = 11
		name = "org.junit.Assume"
	if node.find("junit.rules") > -1:
		id = 12
		name = "org.junit.rules"
	if node.find("apache.commons.io") > -1:
		id = 13
		name = "org.apache.commons.io"
	if node.find("apache.commons.fileupload") > -1:
		id = 14
		name = "org.apache.commons.fileupload"
	if node.find("lang") > -1:
		id = 15
		name = "lang"

	group = {}
	group["id"] = id
	group["name"] = name

	return group
