<template>
    <div id="mode-selector">
      <button @click="showMenu()" class="vertical-center dropbtn">Truss solver</button>
      <!--
      <div id="myDropdown" class="dropdown-content">
          
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>-->
    </div>
</template>
<style scoped>
#mode-selector{
  display: inline-block;
  position: relative;
}
.dropdown-content{
    display:none;    
}
.dropbtn {
    display: inline-block;
    margin: auto 0;
    height: inherit;
    width:  inherit;
    background-color: lightseagreen;
    border: none;
    color: white;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

</style>
