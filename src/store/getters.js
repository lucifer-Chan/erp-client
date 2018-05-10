const getters = {
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.app.visitedViews,
    loginStatus: state => state.user.loginStatus,
    name: state => state.user.name,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    permission_routers: state => state.permission.routers,
    default_openeds: state => state.permission.defaultOpeneds,
    addRouters: state => state.permission.addRouters,
};
export default getters
