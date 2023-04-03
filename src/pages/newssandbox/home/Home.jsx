import React, { Fragment, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
var myChart = ''
var pieMyChart = ''
export default function Home() {
  const [mostView, setMostView] = useState([])
  const [mostLike, setMostLike] = useState([])
  const [allList, setAllList] = useState([])
  const [categories, setCategories] = useState({})
  const [open, setOpen] = useState(false);
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const barRef = useRef(null)
  const picRef = useRef(null)
  //浏览量
  useEffect(() => {
    nProgress.start()
    axios.get('http://localhost:8000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setMostView(res.data)
      // console.log(res.)
    })

  }, [])
  //点赞量
  useEffect(() => {
    nProgress.start()
    axios.get('http://localhost:8000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setMostLike(res.data)
    }).then(nProgress.done())

  }, [])

  // //新闻分类量
  useEffect(() => {
    axios.get('http://localhost:8000/news?publishState=2&_expand=category').then((res) => {
      setCategories(_.groupBy(res.data, items => items.category.title))
      setAllList(res.data)
    })

  }, [])

  //条形图
  useEffect(() => {

    setTimeout(() => {
      // 基于准备好的dom，初始化echarts实例
      //Ref.current 获取DOM节点
      if (myChart !== null && myChart !== "" && myChart !== undefined) {
        myChart.dispose();//解决echarts dom已经加载的报错
      }
      myChart = Echarts.init(barRef.current);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: Object.keys(categories),
          axisLabel: {
            rotate: '45',
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '发布数量',
          minInterval: 1
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: Object.values(categories).map(val => val.length)
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = () => {
        myChart.resize()
      }
    }, 10)
    return () => {
      window.onresize = null
    }
  }, [categories])
  const picView = ()=>{
    var myList = allList.filter(val=>val.author === username)
    var groupList = _.groupBy(myList,item=>item.category.title)
    if (pieMyChart !== null && pieMyChart !== "" && pieMyChart !== undefined) {
      pieMyChart.dispose();//解决echarts dom已经加载的报错
    }
    pieMyChart = Echarts.init(picRef.current);
    var option;

    option = {
      title: {
        text: '我发布的新闻',
        subtext: '新闻分类',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '新闻类别',
          type: 'pie',
          radius: '50%',
          data:Object.values(groupList).map(val=>({value:val.length,name:val[0].category.title})) ,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    pieMyChart.setOption(option)
  }
  // useEffect(()=>{
  //   let category = []
  //   axios.get('http://localhost:8000/categories').then((res) => {
  //     category = res.data.map(val=>({title:val.title,nums:0})
  //     )
  //   })
  //   axios.get('http://localhost:8000/news?publishState=2&_expand=category').then(res=>{
  //     res.data.forEach(val1=>
  //       {
  //         category.forEach(val2=>{
  //           // console.log(val1)
  //           if(val1.category.title===val2.title)
  //             val2.nums += 1
  //         })
  //       })
  //       setCategories([...category])
  //   })
  // },[])
  //图表


  const showDrawer = () => {
    setOpen(true);
    setTimeout(picView,0)

  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                dataSource={mostView}
                renderItem={(item) => {
                  const path = `/news-manage/preview/${item.id}`
                  return (<List.Item>
                    <NavLink to={path}>{item.title}</NavLink>
                  </List.Item>)
                }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={true}>
              <List
                size="small"
                dataSource={mostLike}
                renderItem={(item) => {
                  const path = `/news-manage/preview/${item.id}`
                  return (<List.Item>
                    <NavLink to={path}>{item.title}</NavLink>
                  </List.Item>)
                }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="/news.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={showDrawer} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="/logo.png" />}
                title={username}
                description={
                  <div>
                    <b>{region}</b>{'\u00A0'}{'\u00A0'}
                    <span>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Drawer
        title="个人新闻分类"
        placement='right'
        closable={false}
        onClose={onClose}
        open={open}
        key='right'
        width='45%'
      >
        <div ref={picRef} style={{ height: '80%', width: '100%' }}></div>
      </Drawer>
      {/* 为 ECharts 准备一个定义了宽高的 DOM */}
      <div ref={barRef} style={{ height: '400px', width: '100%', marginTop: '30px' }}></div>

    </Fragment>

  )
}
