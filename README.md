# Description
Feature modelling tool and configurator based on Z3

# Note 
There's a weird issue with Nuget packages and the Z3 reference. When you restore packages, you need to manually go into the 
\packages\z3x86win.4.3.2.1 folder and move the libz3.dll file into the /lib folder (TODO: investigate why this happens)
