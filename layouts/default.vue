<template>
  <div class="min-h-screen bg-background">
    <Sidebar />
    <main class="ml-64 p-4 md:p-0">
      <slot />
    </main>
  </div>
</template>

<style>
@media (max-width: 768px) {
  main {
    margin-left: 0;
    padding-top: 80px;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
