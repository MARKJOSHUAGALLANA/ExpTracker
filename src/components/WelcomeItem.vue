<template>
  <div class="custom-item">
    <div class="custom-icon">
      <slot name="icon"></slot>
    </div>
    <div class="custom-details">
      <h3 class="custom-heading">
        <slot name="heading"></slot>
      </h3>
      <div class="custom-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-item {
  margin-top: 2rem;
  display: flex;
  position: relative;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
}

.custom-icon {
  display: flex;
  place-items: center;
  place-content: center;
  width: 40px;
  height: 40px;
  background-color: #6495ED;
  border-radius: 50%;
}

.custom-details {
  flex: 1;
  margin-left: 1rem;
}

.custom-heading {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #333;
}

.custom-content {
  color: #555;
}

@media (min-width: 1024px) {
  .custom-item {
    margin-top: 0;
    padding: 20px;
  }

  .custom-icon {
    top: calc(50% - 30px);
    left: -50px;
    position: absolute;
    width: 60px;
    height: 60px;
  }
}
</style>
