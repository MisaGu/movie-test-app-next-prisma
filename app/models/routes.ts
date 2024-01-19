export default class Route {
  static readonly login: string = "/login";
  static readonly logout: string = "/logout";
  static readonly movieList = (page = 1, totalPages = 1000) =>
    `/movie/list/${Math.min(Math.max(1, page), totalPages)}`;
  static readonly movieDetail = (id: string) => `/movie/${id}`;
  static readonly movieCreate: string = "/movie/create";
  static readonly movieEdit = (id: string) => `/movie/edit/${id}`;
}
