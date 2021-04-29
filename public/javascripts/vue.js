
// Navigation
Vue.component('component1',{
    template: ' <li class="list-item"><a class="link transition" href="index.html">Home</a></li>'
});
Vue.component('component2',{
    template: '<li class="list-item"><a class="link transition" href="dashboard.html">Dashboard</a></li>'
});
Vue.component('component3',{
    template: '<li class="list-item"><a class="link transition" href="models.html">Models</a></li>'
});

// Models 
var vm1 = new Vue ({
   el: '#models',
   data: {
      obj1: {
       title: 'Device Class',
       description: 'Medical device names, their associated product codes, their classifications, and area of specialization',
      },
      obj2: {
       title: 'FDA-Approved Devices',
       description: 'Safe, and Effective Class II, and Class III devices on the market',
      },
      obj3: {
       title: 'Adverse Events',
       description: 'Reports of serious injuries, deaths, malfunctions, and other undesirable effects associated with the use of medical devices.',
      },
     }
   });
