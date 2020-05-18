call npm install browserify -g
call npm install
copy table.css dist\table.css
browserify table.js --standalone Table -o dist/table.js