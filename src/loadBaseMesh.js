viewController.prototype.loadBaseMesh = function (mesh) {
	var http_request = new XMLHttpRequest();
	var url = "base_mesh.php?mesh="+mesh; 
	var vc_id = ""+this.id;
	http_request.onreadystatechange = handle_json.bind(this);
	http_request.open("GET", url, true);
	http_request.send(null);

	function handle_json() {
		var vc = this;
		if (http_request.readyState == 4) {
			if (http_request.status == 200) {
				var json_data = http_request.responseText;
				var json = JSON.parse(json_data); 
				var i;
				for (i = 0; i< json.vertices.length; i++ ){ 
					vc.mesh.geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(json.vertices[i][0], json.vertices[i][1], json.vertices[i][2] )) );
				}
				for (i = 0; i< json.faces.length; i++ ){ 
					vc.mesh.geometry.faces.push( new THREE.Face3( json.faces[i][0], json.faces[i][1], json.faces[i][2] ) );
				}
	
				vc.mesh.geometry.computeCentroids();
				vc.mesh.geometry.computeFaceNormals();
				vc.mesh.geometry.computeBoundingBox();
				vc.mesh.geometry.dynamic = true;
				
             			// Center mesh
				var offset_x = (vc.mesh.geometry.boundingBox.x[0]+vc.mesh.geometry.boundingBox.x[1])/2; 
				var offset_y = (vc.mesh.geometry.boundingBox.y[0]+vc.mesh.geometry.boundingBox.y[1])/2; 
				var offset_z = (vc.mesh.geometry.boundingBox.z[0]+vc.mesh.geometry.boundingBox.z[1])/2; 
				for (i = 0; i< json.vertices.length; i++ ){ 
					vc.mesh.geometry.vertices[i].position.x -= offset_x;
					vc.mesh.geometry.vertices[i].position.y -= offset_y;
					vc.mesh.geometry.vertices[i].position.z -= offset_z;
				}
			vc.initView();

			} else {
				alert('Server connection error.');
			}
		http_request = null;
		}
	}
}

