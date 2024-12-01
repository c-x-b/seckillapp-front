<template>
  <div id="home">
    <h1 class="seckill-title">Seckill</h1>
    <div class="geometric-pattern"></div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
}

.seckill-title {
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  margin-top: -20%;
}

.geometric-pattern {
  width: 100px;
  height: 100px;
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
</style>
