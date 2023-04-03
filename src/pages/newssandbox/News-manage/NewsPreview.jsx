import React, { useState } from 'react'
import {Descriptions} from 'antd';

import { PageHeader } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsPreview() {
    const [newsInfo,setNewsInfo]=useState([])
    const auditList = ['未审核','待审核','已通过','未通过']
    const publishList = ['未发布','待发布','已发布','已下线']
    const {id} = useParams()
    useEffect(()=>{
        axios.get(`http://localhost:8000/news/${id}?_expand=category&_expand=role`).then(res=>{
            setNewsInfo(res.data)
        })
    },[id])
  return (
    <div className="site-page-header-ghost-wrapper">
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title={newsInfo.title}
      subTitle={newsInfo.length!==0?newsInfo.category.title:''}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
        <Descriptions.Item label="发布时间">{newsInfo.publishTime? moment(newsInfo.pubishTime).format('YYYY/MM/DD HH:mm:ss'):'---'}</Descriptions.Item>
        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
        <Descriptions.Item label="审核状态"><span style={{color:'red'}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
        <Descriptions.Item label="发布状态"><span style={{color:'red'}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
        <Descriptions.Item label="访问数量"><span style={{color:'green'}}>{newsInfo.view}</span></Descriptions.Item>
        <Descriptions.Item label="点赞数量"><span style={{color:'green'}}>{newsInfo.star}</span></Descriptions.Item>
        <Descriptions.Item label="评论数量"><span style={{color:'green'}}>0</span></Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{margin:'5px 16px',border:'1px solid gray',boxSizing:'border-box',padding:"30px"}}></div>
  </div>
  )
}
