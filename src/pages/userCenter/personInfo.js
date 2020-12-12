import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './index.less';
import { connect, history } from 'umi';
import { provinceData } from '@/utils/utils';
import md5 from 'js-md5';

const PersonInfo = props => {
  const { dispatch, user_id, userInfoExam } = props;
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(userInfoExam);
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };

  const backToPage = () => {
    // form.setFieldsValue({
    //   name: userInfo.name,
    //   phone: userInfo.phone,
    //   credential_number: userInfo.credential_number,
    //   city: userInfo.city,
    //   username: userInfo.username,
    // });
    const data = form.getFieldsValue();
    data.password = md5(data.password);
    dispatch({
      type: 'user/changeUserInfo',
      payload: { user_id, data },
    }).then(res => {
      if (!'code' in res) {
        message.success('修改成功!');
        history.goBack();
      } else {
        message.error('修改失败！');
      }
    });
  };

  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrent',
      payload: { page: 1, page_size: 1, user_id: user_id },
    }).then(res => {
      if ('total' in res) {
        setUserInfo(res.user_list);
        form.setFieldsValue({
          name: res.user_list.name,
          phone: res.user_list.phone,
          credential_number: res.user_list.credential_number,
          city: res.user_list.city,
          username: res.user_list.username,
        });
      } else message.error('Error');
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Form form={form} {...layout}>
          <Form.Item label="姓名" name="name">
            <Input
              className={styles.login}
              defaultValue={userInfo.name}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input className={styles.login} defaultValue={userInfo.phone} />
          </Form.Item>
          <Form.Item label="证件类型" name="idType">
            <Select style={{ width: '238.6px' }} defaultValue={1} disabled>
              <Select.Option value={1}>中华人民共和国居民身份证</Select.Option>
              <Select.Option value={2}>港澳台居民居住证</Select.Option>
              <Select.Option value={3}>香港居民身份证</Select.Option>
              <Select.Option value={4}>澳门居民身份证</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="证件编号" name="credential_number">
            <Input
              className={styles.login}
              defaultValue={userInfo.credential_number}
              disabled
            />
          </Form.Item>
          <Form.Item label="城市" name="city">
            <Select disabled defaultValue={provinceData[userInfo.city]}>
              {Object.keys(provinceData).map(province => (
                <Option key={province} value={province}>
                  {provinceData[province]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item id="userId" label="用户名" name="username">
            <Input
              className={styles.login}
              defaultValue={userInfo.sso_name}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码(不少于6位)', min: 6 },
            ]}
          >
            <Input.Password
              className={styles.login}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </Form>
        <div type="flex" align="middle">
          <Button
            style={{ marginTop: '16px', marginRight: '20px' }}
            type="primary"
            onClick={() => {
              backToPage();
            }}
          >
            确认
          </Button>
          <Button
            style={{ marginTop: '16px' }}
            type="primary"
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({
  user_id: user.currentUser.user_id,
  userInfoExam: user.userInfo,
}))(PersonInfo);
