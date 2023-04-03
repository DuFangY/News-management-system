import React from 'react'
import { Table} from 'antd'

export default function NewsPublish(props) {
  const {dataSource,columns} = props
  return (
    <div>
        <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
    </div>
  )
}
