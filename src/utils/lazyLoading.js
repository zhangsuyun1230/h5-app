export default (url) => {
  return () => import(/* webpackChunkName: '[request]' */ '@/pages/' + url);
}
