import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input, Select, Table, Space, Popconfirm, message } from 'antd';
import style1 from '@/css/applicationList.css';

const { Column } = Table;
const page_size = 10;
const myToken = props => {
  const [tokenList, setTokenList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const appStatus = {
    0: '未知',
    1: '待处理',
    2: '同意',
    3: '拒绝',
    4: '取消',
  };
  const {
    location: { query },
  } = props;
  useEffect(() => {
    //请求我的待审批的tokenInfo
    axios({
      method: 'get',
      url: '/api/v1/application',
      params: {
        page: currentPage,
        page_size,
        callee_id: Number(query.userId),
        status: 2,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.application_list);
          setTotal(response.data.total);
        } else throw Error('error status:', response.status);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  function handleChangePage(page) {
    axios({
      method: 'get',
      url: '/api/v1/application',
      params: {
        page: page,
        page_size,
        callee_id: Number(query.userId),
        status: 2,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.application_list);
          setTotal(response.data.total);
          setCurrentPage(page);
        } else throw Error('error status:', response.status);
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <>
      <Table
        className={style1.applicationList}
        dataSource={tokenList}
        pagination={{
          pageSize: 10,
          current: currentPage,
          onChange: handleChangePage,
          total: total,
        }}
      >
        <Column title="召集令id" dataIndex="callup_id" key="callup_id" />
        <Column title="请求描述" dataIndex="desc" key="desc" />
        <Column
          title="请求状态"
          key="status"
          render={(text, record) => <span>{appStatus[record.status]}</span>}
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/system/tokenReceive/showToken/${record.callup_id}`}>
                查看
              </Link>
            </Space>
          )}
        />
      </Table>
    </>
  );
};
export default myToken;
