import * as mssql from '../../Adapters/mssql'
import { Config } from '../..'
import rewire from 'rewire'

const Mockmssql = rewire<typeof mssql>('../../Adapters/mssql')

describe('mssql', () => {
  describe('getAllTables', () => {
    it('should get all tables from all schemas', async () => {
      const mockRawReturn = []
      const mockRaw = jasmine.createSpy('raw').and.returnValue(Promise.resolve(mockRawReturn))
      const mockdb = { raw: mockRaw }
      const adapter = new Mockmssql.default();
      const res = await adapter.getAllTables(mockdb as any, [])
      expect(mockRaw.calls.first().args[0]).not.toContain('WHERE TABLE_SCHEMA IN')
      expect(res).toEqual(mockRawReturn as any)
    })
    it('should get tables from specified schemas', async () => {
      const mockRawReturn = []
      const mockRaw = jasmine.createSpy('raw').and.returnValue(Promise.resolve(mockRawReturn))
      const mockdb = { raw: mockRaw }
      const adapter = new Mockmssql.default();
      const res = await adapter.getAllTables(mockdb as any, ['schema1', 'schema2'])
      expect(mockRaw.calls.first().args[0]).toContain('WHERE TABLE_SCHEMA IN (:schemas)')
      expect(mockRaw.calls.first().args[1]).toEqual({ schemas: ['schema1', 'schema2'] })
      expect(res).toEqual(mockRawReturn as any)
    })
  })
  describe('getAllColumnsTables', () => {
    it('should get all columns for a given table and schema', async () => {
      const mockRawReturn = [
        {
          name: 'name',
          type: 'type',
          isNullable: 'NO',
          isOptional: 1,
          isEnum: false,
          isPrimaryKey: 1,
          comment: 'comment'
        },
        {
          name: 'name2',
          type: 'type2',
          isNullable: 'YES',
          isOptional: 1,
          isEnum: false,
          isPrimaryKey: 0,
          comment: 'comment2'
        },
        {
          name: 'name3',
          type: 'type3',
          isNullable: 'NO',
          isOptional: 0,
          isEnum: false,
          isPrimaryKey: 0,
          comment: 'comment3'
        },
        {
          name: 'name4',
          type: 'type4',
          isNullable: 'YES',
          isOptional: 0,
          isEnum: false,
          isPrimaryKey: 0,
          comment: 'comment4'
        },
      ]
      const mockRaw = jasmine.createSpy('raw').and.returnValue(Promise.resolve(mockRawReturn))
      const mockdb = { raw: mockRaw }
      const adapter = new Mockmssql.default();
      const mockConfig = {} as Config
      const res = await adapter.getAllColumns(mockdb as any, mockConfig, 'table', 'schema')
      expect(mockRaw.calls.first().args[0]).toContain('TABLE_NAME = :table')
      expect(mockRaw.calls.first().args[0]).toContain('TABLE_SCHEMA = :schema')
      expect(mockRaw.calls.first().args[1]).toEqual({ table: 'table', schema: 'schema' })
      expect(res).toEqual([
        {
          name: 'name',
          type: 'type',
          nullable: false,
          optional: true,
          isEnum: false,
          isPrimaryKey: true,
          comment: 'comment'
        },
        {
          name: 'name2',
          type: 'type2',
          nullable: true,
          optional: true,
          isEnum: false,
          isPrimaryKey: false,
          comment: 'comment2'
        },
        {
          name: 'name3',
          type: 'type3',
          nullable: false,
          optional: false,
          isEnum: false,
          isPrimaryKey: false,
          comment: 'comment3'
        },
        {
          name: 'name4',
          type: 'type4',
          nullable: true,
          optional: true,
          isEnum: false,
          isPrimaryKey: false,
          comment: 'comment4'
        },
      ])
    })
  })
})
