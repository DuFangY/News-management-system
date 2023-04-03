import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import { Card, Col, Row, List, } from 'antd';
import { NavLink } from 'react-router-dom';
import * as _ from 'lodash'

export default function News() {
    const [news, setNews] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8000/news?publishState=2&_expand=category&_sort=view&_order=desc').then((res) => {
            // console.log(Object.entries(_.groupBy(res.data, items => items.category.title)))
            setNews(Object.entries(_.groupBy(res.data, items => items.category.title)))
        })
    }, [])
    return (
        <div style={{ width: '95%', margin: '0 auto' }}>
            <PageHeader
                ghost={false}
                title='全球新闻系统'
                subTitle='查看系统'
            ></PageHeader>
            <Row gutter={[16, 16]}>

                {
                    news.map(val =>
                        <Col span={8} key={val[0]}>
                            <Card title={val[0]} bordered={true} hoverable>
                                <List
                                    size="small"
                                    dataSource={val[1]}
                                    pagination={{ pageSize: 6 }}
                                    renderItem={(item) => {
                                        const path = `/detail/${item.id}`
                                        return (<List.Item>
                                            <NavLink to={path}>{item.title}</NavLink>
                                        </List.Item>)
                                    }}
                                />
                            </Card>
                        </Col>
                    )
                }

            </Row>
        </div>
    )
}
