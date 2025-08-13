import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'
import CheckVulnerabilityView from '../views/CheckVulnerabilityView.vue'
import ResearchCompareView from '@/views/ResearchCompareView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'explore',
    component: ExploreView,
  },
  {
    path: '/vuln/:vulnerability',
    name: 'check-vulnerability-view',
    component: CheckVulnerabilityView,
    props: true
  },
  {
    path: '/compare/:researchGroup',
    name: 'research-compare-view',
    component: ResearchCompareView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
  


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
