import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input, Select, Table, Space, Popconfirm, message } from 'antd';
import styles from '@/css/searchToken.css';
import { provinceData } from '@/global';

const { Search } = Input;
const { Option } = Select;
const { Column } = Table;
const page_size = 10;
const statusList = {
  0: '未知',
  1: '待响应',
  2: '已完成',
  3: '取消',
  4: '到期未达成',
};
const typleList = {
  0: '未知',
  1: '技术交流',
  2: '学业探讨',
  3: '社会实践',
  4: '公益志愿者',
  5: '游玩',
};
const allToken = props => {
  const [tokenList, setTokenList] = useState();
  const [searchClass, setSearchClass] = useState();
  const [searchName, setSearchName] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const {
    location: { query },
  } = props;
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/v1/callup',
      params: {
        page: currentPage,
        page_size,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.callup_list);
          setTotal(response.data.total);
        } else throw Error('error status:', response.status);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const searchByName = value => {
    setSearchName(value);
    console.log(value);
    setSearchClass(null);
    axios({
      method: 'get',
      url: '/api/v1/callup',
      params: {
        page: currentPage,
        page_size,
        fuzzy_name: value,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.callup_list);
          setTotal(response.data.total);
        } else throw Error('error status:', response.status);
      })
      .catch(error => {
        console.log(error);
      });
  };

  function searchByClass(value) {
    setSearchClass(value);
    setSearchName(null);
    console.log(value);
    axios({
      method: 'get',
      url: '/api/v1/callup',
      params: {
        page: currentPage,
        page_size,
        type: value,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.callup_list);
          setTotal(response.data.total);
        } else throw Error('error status:', response.status);
      })
      .catch(error => {
        console.log(error);
      });
  }
  function handleChange(e) {
    setSearchName(e.target.value);
  }
  function handleChangePage(page) {
    axios({
      method: 'get',
      url: '/api/v1/callup',
      params: {
        page,
        page_size,
      },
    })
      .then(response => {
        if (response.status === 200) {
          setTokenList(response.data.callup_list);
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
      <Search
        className={styles.search}
        placeholder="input search text"
        onSearch={searchByName}
        enterButton
        value={searchName}
        onChange={handleChange}
      />
      <Select
        className={styles.search}
        placeholder="please select"
        onChange={searchByClass}
        value={searchClass}
      >
        <Option value={1}>技术交流</Option>
        <Option value={2}>学业探讨</Option>
        <Option value={3}>社会实践</Option>
        <Option value={4}>公益志愿者</Option>
        <Option value={5}>游玩</Option>
      </Select>
      <Table
        className={styles.showList}
        dataSource={tokenList}
        pagination={{
          pageSize: 10,
          current: currentPage,
          onChange: handleChangePage,
          total: total,
        }}
      >
        <Column title="名称" dataIndex="name" key="name" />
        <Column
          title="类别"
          key="type"
          render={(text, record) => (
            <Space size="middle">{typleList[record.type]}</Space>
          )}
        />
        <Column
          title="地点"
          key="city"
          render={(text, record) => (
            <Space size="middle">{provinceData[record.city]}</Space>
          )}
        />
        <Column title="目标人数" dataIndex="quota" key="quota" />
        <Column
          title="令主id"
          key="caller_id"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/admin/userInfo/${record.caller_id}`}>
                {record.caller_id}
              </Link>
            </Space>
          )}
        />
        <Column title="已召集人数" dataIndex="success_num" key="success_num" />
        <Column
          title="结束时间"
          key="end_time"
          render={(text, record) => (
            <Space size="middle">
              {new Date(record.end_time * 1000).toLocaleString()}
            </Space>
          )}
        />
        <Column
          title="状态"
          key="status"
          render={(text, record) => (
            <Space size="middle">{statusList[record.status]}</Space>
          )}
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/admin/tokenInfo/${record.id}`}>查看</Link>
            </Space>
          )}
        />
      </Table>
    </>
  );
};
export default allToken;
