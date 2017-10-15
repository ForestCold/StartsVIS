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
	node_id_map = {}
	nodes = []
	nodes_set = []
	links = []

	with open(fpath) as f:
		for line in f.readlines():
			link = {}
			link['source'] = line.split()[0]
			link['target'] = line.split()[1]
			link['value'] = 1
			links.append(link)
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

	data['links'] = links
	data['nodes'] = nodes_set

	return json.dumps(data)

def cal_group(node):
	if node.find("junit.internal") > -1:
		return 1
	if node.find("apache") > -1:
		return 2
	if node.find("hamcrest") > -1:
		return 3
	if node.find("util") > -1:
		return 4
	if node.find("servlet") > -1:
		return 5
	if node.find("portlet") > -1:
		return 6
	if node.find("junit.runners") > -1:
		return 7
	if node.find("junit.experimental") > -1:
		return 8
	if node.find("junit.validator") > -1:
		return 9
	if node.find("junit.framework") > -1:
		return 10
	if node.find("junit.Assume") > -1:
		return 11
	if node.find("io") > -1:
		return 12
	if node.find("lang") > -1:
		return 13
	return 14
