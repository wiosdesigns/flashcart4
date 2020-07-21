let items;
let inventory;
let categories;
let settings = {
  showOutOfStockItems: true,
  showDescription: false,
  currency: '₹',
  shopphone: '919538065734',
  shopemail: 'None',
  inventoryURL: '/inventory.csv'
};

function init(){
  navigator.serviceWorker && navigator.serviceWorker.register('/codefiles/js/sw.js').then(function(registration) {
    registration.addEventListener('updatefound',function(){
      caches.delete('the-magic-cache');
      window.location.reload(true);
    })
    console.log('Excellent, registered with scope: ', registration.scope);
  });
  
  Papa.parse(settings.inventoryURL, {
	  download: true,
	  header: true,
	  complete: function(results) {
		  items = results.data;
		  items_loaded();
	  }
  });
}


function sanitizeFloat(n){
  n = n.toFixed(3);
  n = parseFloat(n);
  return n
}

function items_loaded(){
  document.getElementById("loading").style.display = "none";
  document.getElementById("app").style.display = "inline-grid";
  if(items[items.length-1]['Name']==""){
    items.pop();
  }
  
  categories = [];
  
  for(var i=0;i<items.length;i++){
    	  
    if(!categories.includes(items[i].Category)){
      categories.push(items[i].Category);
    }
    items[i]['In Stock'] = items[i]['In Stock'].toLowerCase()=="yes";
    items[i].quantity = 0;
    items[i].match = true;
  }
	
  
  items.sort(function(item_a,item_b){
    return item_a.Name.localeCompare(item_b.Name);
  })
	
	console.log(items);
  
	
  Vue.component('shop-item',{
    props: ['name','image','category','unitprice','unit','instock','description','value','compact'],
    template: '#shop-item-template',
    data: function(){
      return {
        addtocart: true
      };
    },
    methods: {
      increment: function(){
        console.log(this.value);
        this.addtocart = false;
        this.value+=1.0;
        this.value = sanitizeFloat(this.value);
        console.log(this.value);
        this.$emit('input',this.value);
      },
      decrement: function(){
        console.log(this.value);
        this.value = parseFloat(this.value);
        if(this.value>=1){
          this.value-=1.0;
        }
        else{
          this.value=0;
        }
        this.value = sanitizeFloat(this.value);
        console.log(this.value);
        this.$emit('input',this.value);
      },
      change: function(e){
        console.log(this.value);
        this.value = e.target.value;
        this.value = parseFloat(this.value);
        if(this.value<0){
          this.value = 0;
        }
        this.value = sanitizeFloat(this.value);
        console.log(this.value);
        this.$emit('input',this.value);
      }
    }
  });
  
  app = new Vue({
    el: "#app",
    data: {
      categories: categories,
      items: items,
      settings: settings,
      cartpage: false,
      name: '',
      address: '',
      page: '',
      activeCategory: 'All Categories',
    },
    computed: {
      carttotal: function(){
        var t = 0;
        for(var i=0;i<this.items.length;i++){
          t += this.items[i].quantity*this.items[i]['Unit Price'];
        }
        return t;
      },
      nitems: function(){
        var n = 0;
        for(var i=0;i<this.items.length;i++){
          if(this.items[i].quantity>0) n++;
        }
        return n;
      },
      ordertext: function(){
        var s = `${app.name} would like to order the following items: \n`;
        for(var i=0;i<this.items.length;i++){
          if(this.items[i].quantity>0){
            s += `\n\n${this.items[i].Name}\nQuantity: ${this.items[i].quantity} ${this.items[i].Unit}`
          }
        }
        s += `\n\nTotal: ${app.settings.currency}${app.carttotal}`;
        s += `\n\nAddress: ${app.address}`;
        return s
        
      } 
    },
    watch: {
      'name': function(){
        localStorage.setItem('name',this.name);
      },
      'address': function(){
        localStorage.setItem('address',this.address);
      }
    },
    methods: {
      orderwa: function(){
        this.name = this.name.trim();
        this.address = this.address.trim();
        if(!this.name){
          alert('Please enter your name');
          return;
        }
        if(!this.address){
          alert('Please enter your address');
          return;
        }
        location.href = `https://wa.me/${app.settings.shopphone}/?text=${encodeURIComponent(app.ordertext)}`;
      },
      filter_items: function(){
        var query = document.querySelector('#searchquery').value;
        query = query.trim().toLowerCase();
        console.log(this.activeCategory);
        
        for(var i=0;i<app.items.length;i++){
          var target = app.items[i].Name.toLowerCase();
          app.items[i].match = true;
          if(query && !target.includes(query)){
            app.items[i].match = false;
          }
          if(this.activeCategory!='All Categories' && this.activeCategory!=items[i].Category){
            app.items[i].match = false;
          }
        }
      }
    }
  });
  hnav.init();
  if ('name' in localStorage){
    app.name = localStorage.getItem('name');
  }
  if ('address' in localStorage){
    app.address = localStorage.getItem('address');
  }
}

function goToOrder(){
  document.getElementById('placeorder').scrollIntoView();
}



