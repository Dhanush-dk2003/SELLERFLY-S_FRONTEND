import API from '../../../axios';

export const fetchInboxMessages = async () => {
  const res = await API.get('/messages');
  return res.data;
};

export const sendMessage = async (messageData) => {
  const res = await API.post('/messages', messageData);
  return res.data;
};

export const deleteMessage = async (id) => {
  const res = await API.delete(`/messages/${id}`);
  return res.data;
};

export const updateMessageStatus = async (id, status) => {
  const res = await API.patch(`/messages/${id}/status`, { status });
  return res.data;
};
