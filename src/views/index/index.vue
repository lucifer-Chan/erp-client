<template>
    <div class="app-container">
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {
        },
        data() {
            return {
                name: '',
            }
        },
        computed: {
            ...mapGetters([
                'permission_routers',
            ])
        },
        methods: {
            goClaim() {
//                const preserve = this.permission_routers.filter(item => {
//                    if (item.name === '审核及资料输入') {
//                        return true
//                    }
//                    return false
//                })
//                console.log(preserve)
//                if(preserve[0].children.length > 1) {
//                    this.$router.push('/preserve/1');
//                }
            },
        },
        created() {
            this.goClaim()
        }
    }
</script>

<style scoped lang="scss">

</style>