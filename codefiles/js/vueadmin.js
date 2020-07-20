function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}


var app = new Vue({
	el: '#welcome',
	data: {
		token: localStorage.getItem('local_token'),
		csv:"",
		showPopUp:true,
	},
	methods: {
		upload: async function(){

			if(!this.csv){
				alert("Please select a CSV file and then click Upload");
				return;
			}
      
      localStorage.setItem('local_token', this.token);

      var file = document.getElementById("csvdoc").files[0];
      const encoded_string = await getBase64(file);

      url = 'https://api.github.com/repos/"username"/"repo_name"/contents/inventory.csv'
      
      var get = await fetch(url,{
      	method: 'GET',
      	mode: 'cors',
      	headers:{
      		Authorization: "token " + this.token
      	}
      });

      get = await get.json();
			var sha = get["sha"];

      
      var response = await fetch(url,{
      	method: 'PUT',
      	mode: 'cors',
      	headers:{
      		Authorization: "token " + this.token
      	},
      	body: `{"message": "updating item list", "content": "${encoded_string}", "sha":"${sha}"}`
      });

      console.log(response["status"]);
      console.log(response);

		}
	}
});