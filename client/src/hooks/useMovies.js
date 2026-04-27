import { useQuery } from '@tanstack/react-query';
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchPopularTv,
  fetchTopRatedTv,
  fetchMovieDetail,
  fetchTvDetail,
  fetchSearch,
} from '../api/movies';

export const useTrending = () =>
  useQuery({ queryKey: ['trending'], queryFn: fetchTrending });

export const usePopularMovies = () =>
  useQuery({ queryKey: ['movies', 'popular'], queryFn: fetchPopularMovies });

export const useTopRatedMovies = () =>
  useQuery({ queryKey: ['movies', 'top-rated'], queryFn: fetchTopRatedMovies });

export const usePopularTv = () =>
  useQuery({ queryKey: ['tv', 'popular'], queryFn: fetchPopularTv });

export const useTopRatedTv = () =>
  useQuery({ queryKey: ['tv', 'top-rated'], queryFn: fetchTopRatedTv });

export const useMovieDetail = (id) =>
  useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetail(id),
    enabled: !!id,
  });

export const useTvDetail = (id) =>
  useQuery({
    queryKey: ['tv', id],
    queryFn: () => fetchTvDetail(id),
    enabled: !!id,
  });

export const useSearch = (q) =>
  useQuery({
    queryKey: ['search', q],
    queryFn: () => fetchSearch(q),
    enabled: !!q && q.trim().length > 0,
  });
