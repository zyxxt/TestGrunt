"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("./project.json", {
            encoding: 'utf-8'
        }),

        // 检查代码是否都符合 jshint
        jshint: {
            first: {
                options: {
                    reporterOutput: /*'jshint.log'*/null,
                    jshintrc: ".jshintrc"      // 外部配置文件
                },

                src: [
                    "./src/**/*.js"
                ]
            },
            second: {
                options: {
                    jshintrc: ".jshintrc"      // 外部配置文件
                },

                src: [
                    "./src/**/*.js"
                ]
            }

        },

        myFirstTask: {
            a: 'abc',
            b: 'bbc',
            c: 'cbc',
            suba: {
                subb: 'subbbbbbbbb'
            }
        },

        tabtospace: {
            options: {
                spaceCnt: 4
            },
            src: [
                './src/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 测试下我自己写的这个插件有没有问题
    //grunt.loadNpmTasks('grunt-tabtospace');

    grunt.loadTasks('./task/tabtospace');


    grunt.registerTask("xxx", ["测试下registerTask怎么用"], ['jshint']);

    // grunt myFirstTask:a 这样执行后，this.data的值是：abc
    // grunt myFirstTask:b 这样执行后，this.data的值是：bbc
    // 这里的function也是可以直接传参数进来的，比下面
    grunt.registerMultiTask("myFirstTask", ["测试下registerTask怎么用"], function (/*arg1, arg2*/) {
        grunt.log.writeln(this.data);
//        grunt.log.writeln(arg1 + '!!!!!!!!!!!' + arg2);
    });

    // arg1, arg2  可以在运行的时候传进来。比如：grunt singleTask:arg1:agr2  可以用: 分隔传多个参数进来
    grunt.registerTask('singleTask', ['描述'], function (arg1, arg2) {
        grunt.log.writeln(arg1);
        grunt.log.writeln(arg2);
        return true;
    });

    grunt.registerTask('zyt', function () {
        // 这里可以直接调用其它任务
        grunt.task.run('singleTask:arg1:arg2');

        // 用 require 来检测其它任务是否已经执行了，如果未执行或者执行失败，任务会直接退出。--force...
        // grunt.task.requires('singleTask');

        // require 还可以来判断属性是否存在，如果判断多个可以用逗号隔开，比如：
        grunt.config.requires('myFirstTask.a');
        grunt.config.requires(['myFirstTask', 'a']);  // 跟上面那一行是等价的

        grunt.log.writeln('这里获取config里myFirstTask.a的值：%s', grunt.config('myFirstTask.a'));

        grunt.log.writeln('log my custom task: zyt');
    });

    // 任务也可以是异步执行的，比如：
    grunt.registerTask('zytAsync', function () {
        // 这里指明任务是异步的，这一行放什么位置都是可以的
        grunt.log.writeln('a');
        var done = this.async();
        // 下面用setTimeout来模拟回调
        setTimeout(function () {
            // do something else
            // ...
            grunt.log.writeln('c');
            grunt.task.run('zyt');
            grunt.log.writeln('d');
            // 最后用调用done来结束任务
            done(true);
        }, 1000);
        grunt.log.writeln('b');
    });

};

