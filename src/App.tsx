import React from 'react';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';

import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';

import axios from 'axios';
import copy from 'copy-to-clipboard';

import {render as renderAmis, ToastComponent, AlertComponent} from 'amis';
import {alert, confirm, toast} from 'amis-ui';

// amis 环境配置
const env = {
  // 下面三个接口必须实现
  fetcher: ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers // 请求头
  }: any) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    config.headers = headers || {};

    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }
      return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }

    return (axios as any)[method](url, data, config);
  },
  isCancel: (value: any) => (axios as any).isCancel(value),
  copy: (content: string) => {
    copy(content);
    toast.success('内容已复制到粘贴板');
  }

  // 后面这些接口可以不用实现

  // 默认是地址跳转
  // jumpTo: (
  //   location: string /*目标地址*/,
  //   action: any /* action对象*/
  // ) => {
  //   // 用来实现页面跳转, actionType:link、url 都会进来。
  // },

  // updateLocation: (
  //   location: string /*目标地址*/,
  //   replace: boolean /*是replace，还是push？*/
  // ) => {
  //   // 地址替换，跟 jumpTo 类似
  // },

  // isCurrentUrl: (
  //   url: string /*url地址*/,
  // ) => {
  //   // 用来判断是否目标地址当前地址
  // },

  // notify: (
  //   type: 'error' | 'success' /**/,
  //   msg: string /*提示内容*/
  // ) => {
  //   toast[type]
  //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
  //     : console.warn('[Notify]', type, msg);
  // },
  // alert,
  // confirm,
};

class AMISComponent extends React.Component<any, any> {
  render() {
    return renderAmis(
      // 这里是 amis 的 Json 配置。
      {
        type: 'page',
        body: {
          type: 'crud',
          api: 'get:/api/user/page',
          headerToolbar: ['bulkActions', 'reload'],
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: 'delete:/api/user/${ids}',
              confirmText: '确定要批量删除?'
            }
          ],
          autoGenerateFilter: true,
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'name',
              label: '用户名',
              searchable: {
                type: 'input-text',
                name: 'name',
                label: '用户名',
                placeholder: '输入用户名'
              }
            },
            {
              name: 'password',
              label: '密码'
            },
            {
              name: 'store_id',
              label: '所属店仓'
            },
            {
              name: 'dept_id',
              label: '所属部门'
            },
            {
              type: 'operation',
              label: '操作',
              buttons: [
                {
                  label: '详情',
                  type: 'button',
                  level: 'link',
                  actionType: 'dialog',
                  dialog: {
                    title: '查看详情',
                    body: {
                      type: 'form',
                      body: [
                        {
                          type: 'input-text',
                          name: 'engine',
                          label: 'Engine'
                        },
                        {
                          type: 'input-text',
                          name: 'browser',
                          label: 'Browser'
                        },
                        {
                          type: 'input-text',
                          name: 'platform',
                          label: 'platform'
                        },
                        {
                          type: 'input-text',
                          name: 'version',
                          label: 'version'
                        },
                        {
                          type: 'control',
                          label: 'grade',
                          body: {
                            type: 'tag',
                            label: '${grade}',
                            displayMode: 'normal',
                            color: 'active'
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  label: '删除',
                  type: 'button',
                  level: 'link',
                  className: 'text-danger',
                  confirmText: '确认要删除？',
                  actionType: 'ajax',
                  api: 'delete:/api/user/${id}'
                }
              ]
            }
          ]
        }
      },
      {
        // props...
      },
      env
    );
  }
}

class APP extends React.Component<any, any> {
  render() {
    return (
      <>
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <AMISComponent />
      </>
    );
  }
}

export default APP;
