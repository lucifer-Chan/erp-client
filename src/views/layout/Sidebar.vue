<template>
    <el-menu mode="vertical" theme="dark" :default-active="$route.path" :default-openeds="default_openeds">
        <sidebar-item :routes='permission_routers'></sidebar-item>
    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SidebarItem from './SidebarItem';
    export default {
        components: {SidebarItem},
        computed: {
            ...mapGetters([
                'permission_routers',
                'default_openeds',
            ])
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-menu {
        min-height: 100%;
        border-radius: 0;
    }
</style>
