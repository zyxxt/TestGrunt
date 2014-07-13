"use strict";
module.exports = function (grunt) {
    grunt.registerMultiTask('tabtospace', 'replace tab to space', function () {
        var options = this.options({
            spaceCnt: 4,
            encoding: 'utf-8'
        });

        var getSpace = function () {
            var space = [];
            var i = 0;
            while (i < options.spaceCnt) {
                space.push(' ');
                i++;
            }
            return space.join('');
        };
        var analysisFileData = function (data) {
            //
            data = data.replace(/^(\s)+/gm, function (tab) {
                var space = getSpace();
                var ret = tab.replace(/\t/g, space);
                return ret;
            });
            return data;
        };

        var fs = require('fs');
        var readFile = function (file) {
            // 读写文件都用同步的方式吧，异步的话要处理 var done = async(); done(true);要在所有文件处理完后调用回调
            // 有点麻烦
            var data = fs.readFileSync(file, {
                encoding: options.encoding
            });
            data = analysisFileData(data);

            fs.writeFileSync(file, data, {
                encoding: options.encoding
            });

            grunt.log.ok('file: "%s" ----> success', file);
        };
        var tabToSpace = function (file) {
            if (!grunt.file.exists(file)) {
                // 文件不存在
                grunt.verbose.warn('The file: "%s" is not exist.', file);
                return ;
            }
            if (!grunt.file.isFile(file)) {
                grunt.verbose.warn('"%s" is not a file');
                return ;
            }
            readFile(file);
        };

        this.files.forEach(function (file) {
            file.src.forEach(function(f) {
                tabToSpace(f);
            });

        });
    });
};