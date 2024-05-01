import { Request } from '../api/Request'
import type { AxiosRepository } from '../repository/AxiosRepository'

export function useAxiosApi (repository: AxiosRepository) {
  return new Request(repository)
}
