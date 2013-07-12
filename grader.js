#!/usr/bin/env node

/*automatically grade files for the presence of specified HTML tags/attributes. Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.
*/

var util = require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); //http://nodejs.org/api/process.html#process_process_exit_code
	}
    return instr;
    };

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(fs.readFileSync(htmlfile));
    };

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
    };

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
	}
    return out;
    };

var clone = function(fn) {
    //Workaround for commander.js issue.
    //http://stackoverflow.com/a/6772648
    return fn.bind({});
    };

var checkWebPage = function(web_url, checksfile){
        
    rest.get(web_url).on('complete', function(result){
        if(result instanceof Error){
            console.log("%s cannot be found: %s", instr, result.message);
            process.exit(1);
            }
        else{
	    fs.writeFileSync("urlpage.html", result);
	    var html = "urlpage";
	    var checkJson = checkHtmlFile(html, program.checks);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
	    
            }
	             
            
        });
};


if(require.main == module) {
    program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <url>', "URL to page to test", String)
    .parse(process.argv);
    if (program.url){
	var web_url=program.url.toString();
	checkWebPage(web_url, program.checks);
	
	}
    else {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
	}
    } 
else {
	exports.checkHtmlFile = checkHtmlFile;
}
