# BouncingBalls
This is the computer graphic project I have done during University using WebGL.
User manual of CSI4130 Computer Graphics final project

Background: 
This project is based on the knowledge we learned from assignment 2 and assignment 3 with additional functions. 

Goal:
The goal of this project is to simulate the movement of water molecules in different temperature. It allows user to see the movement of the water molecules’ movement in different temperature in different angle.

Achievement:
This project has rich options to let users manipulate and observe the movement of water molecules. It comes with clean user interface and the functions are easy to use. When the water molecules are generated, they will appear at the center of the space and they will drop down to the floor. After hit the floor, they will bounce back towards random directions. The intensity of bounce will be decreasing as time goes on, and they will eventually stay at the bottom of the space. Please see below how to use section to explore all the functions. 

How to use:

To open the project, simply open index.html using Chrome or Firefox, the UI will appear. 

1.	The basic scene is a 3D cube space with perspective view and with different colors in each face, users can drag the RotateX and RotateY options on the up-right corner to adjust the different viewing angle of the space. 
2.	The project uses spheres to represent the water molecules, users can change the ambient of the water molecules using the ambient option on the up-right corner to change it. 
3.	Users can change the diffuse of the water molecules using the diffuse option on the up-right corner to change it.
4.	Users can change the specular of the water molecules using the diffuse option on the up-right corner to change it.
5.	Users can change the shininess of the water molecules using the shininess option on the up-right corner to change it.
6.	Users can change the radius (size) of the water molecules using the radius option on the up-right corner to change it.
7.	Users can change the movement speed (in different temperature level) of the water molecules using the power option on the up-right corner to change it.
8.	Users can set random size to the molecules by simply click the random_radius option on the up-right corner. 
9.	Users can set random color to the molecules by simply click the random_color option on the up-right corner. 
10.	To generate the desired molecules, after set all above attributes to the desired form, then drag the sphere_num on the up-right control window to generate the desired number of molecules. 



External source used:
-	dat.gui.js
-	gl-matrix-min.js
-	wevgl-utils.js
 
