<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initialize()
})
</script>

<template>
  <div id="app" class="app-container">
    <AppHeader />
    
    <div class="main-layout">
      <AppSidebar />
      
      <main class="main-content" :class="{ 'sidebar-collapsed': appStore.sidebarCollapsed }">
        <div class="content-wrapper">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>
    </div>
    
    <AppFooter />
    
    <!-- 全局加载遮罩 -->
    <LoadingSpinner v-if="appStore.isLoading" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  background: linear-gradient(135deg, #F5E6D3 0%, #FAF0E6 100%);
  min-height: calc(100vh - 120px);
}

.main-content.sidebar-collapsed {
  margin-left: 64px;
}

.content-wrapper {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}

@media screen and (max-width: 480px) {
  .content-wrapper {
    padding: 12px;
  }
}
</style>
