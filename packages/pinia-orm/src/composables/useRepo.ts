import { defineStore, Pinia, StoreDefinition } from 'pinia'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import { Constructor } from '../types'
import { useStoreActions } from './useStoreActions'

export function useRepo<M extends Model>(
  model: Constructor<M>,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
): Repository<M>

export function useRepo<R extends Repository>(
  repository: Constructor<R>,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
): R

export function useRepo(
  modelOrRepository: any,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
) {
  let database: Database
  // const store = defineStore(connection || 'database', {
  //   state: () => ({ entities: {} }),
  // })

  // if (connection) {
  // if (!(connection in store.$databases)) {
  //   database = createDatabase(store, { namespace: connection })
  //   database.start()
  // } else {
  //   database = store.$databases[connection]
  // }
  // } else {
  database = new Database().setConnection(connection || 'database')
  // .setStore(store)
  // }

  const repository = modelOrRepository._isRepository
    ? new modelOrRepository(database).initialize()
    : new Repository(database).initialize(modelOrRepository)

  if (storeGenerator) {
    repository.database.setStore(storeGenerator)
  }

  try {
    database.register(repository.getModel())
  } catch (e) {}

  return repository

  // return defineStore(model.$entity(), {
  //   state: () => {
  //     return model.$fields()
  //   },
  // })
}
