import json
import os
import numpy

from app import app
from flask import Flask, request

debug = False

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/list')
def _list():
	datalist = [name for name in os.listdir("app/data")]

	if ".DS_Store" in datalist:
		datalist.remove(".DS_Store")

	return json.dumps(datalist)

@app.route('/data/<dataname>')
def _data(dataname):
	# data preprocessing
	fpath = 'app/data/' + dataname.rstrip('.txt') + '/' + dataname
	data = {}
	graph = {}
	source = []
	node_id_map = {}
	nodes = []
	nodes_set = []
	links = []

	with open(fpath) as f:
		for line in f.readlines():
			link = {}
			row = {}
			link['source'] = line.split()[0]
			row['source'] = line.split()[0]
			link['target'] = line.split()[1]
			row['target'] = line.split()[1]
			link['value'] = 1
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
			nodes_set.append(node_info)
		exist = 0

	for link in links:
		link['source'] = node_id_map[link['source']]
		link['target'] = node_id_map[link['target']]

	graph['links'] = links
	graph['nodes'] = nodes_set

	data["source"] = source
	data["graph"] = graph

	return json.dumps(data)

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
