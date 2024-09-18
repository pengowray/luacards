local js = require "js"
local log = js.global.gardenlog

print = (function(string)
  log:print(string)
end)

print("# Hello world!")
print(" - a simple thing")

a = 2 + 2
print("Total: " .. a)
