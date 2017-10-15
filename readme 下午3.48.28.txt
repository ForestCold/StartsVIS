系统安装 Instruction:

	1. 首先安装 Python 2.7
	    安装过程参考：http://lihuipeng.blog.51cto.com/3064864/850562
	
	2. 安装pip
	    安装过程参考：https://pip.pypa.io/en/stable/installing/
	
	3. 用pip安装相应的python 包：
	    a). 安装 Flask 框架：在命令行中输入 "pip install -U flask" （参考：http://flask.pocoo.org/）
	    b). 安装 机器学习包 scikit-learn ：在命令行中输入 “pip install -U scikit-learn” （参考：http://scikit-learn.org/stable/）
	    
	4. 安装Chrome Browser
	
	5. 运行程序
	    a) 安装好以后，进入程序目录，找到 run.py， 然后运行 "python run.py"。 
	    b) 在browser 中 打开链接 :"127.0.0.1:5000"， 既可以看到网站的运行结果

系统开发
	1. 服务器端的程序用python 编写
	2. 程序放在 app/routes/ 目录下
	3. 网站路径的主调函数为 app/routes/index.py

客户端开发
    1. 服务器端的程序用 javascript + html 编写
    2. 程序放在 app/static/ 目录下
    


