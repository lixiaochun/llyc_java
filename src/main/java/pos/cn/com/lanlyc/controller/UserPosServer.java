package pos.cn.com.lanlyc.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;

import cn.com.lanlyc.base.util.ConstantUtils;
import cn.com.lanlyc.base.util.DataUtils;
import cn.com.lanlyc.core.util.Response;
import gate.cn.com.lanlyc.core.po.GateUser;
import pos.cn.com.lanlyc.core.dto.PosSimpleUserDto;
import pos.cn.com.lanlyc.core.po.PosCardType;
import pos.cn.com.lanlyc.core.po.PosTrajectory;
import pos.cn.com.lanlyc.core.service.PosServiceContainer;

/**
 * 
 * @author cjt
 * 建立websorket连接，将最新人员坐标发送给前台
 *
 */
@Component("UserPosServer")
@ServerEndpoint(value = "/userposserver")
public class UserPosServer {
	protected final static String SessionContainer_Key = ConstantUtils.getConstant("Session_User_key");
	@Autowired
	private PosServiceContainer service;
	public static UserPosServer testUtils;
	public static String layer_id;
	private Session session;
	// 每个Session 对应所属图层 layer_id=>id
	private static final Map<String, Object> area_session = new HashMap<String, Object>();

	private static final Map<String, String> area_sessionid = new HashMap<String, String>();

	protected PosServiceContainer getService() {
		return testUtils.service;
	}

	@PostConstruct
	public void init() {
		testUtils = this;
	}

	private static int count = 0;
	// 如果有客户端来连接则存在此数组中

	@OnOpen
	public void open(Session session) {
		this.session = session;

		System.out.println("有客户端进行连接");
	}

	// 发送最新位置(外部调用)
	public Boolean sendnew_pos(List<PosTrajectory> posList,long l) {
		
		List<PosSimpleUserDto> pos_datas = new ArrayList<>();
		for (PosTrajectory pt : posList) {
			if(pt.getStationId()!=null && pt.getStationId().equals(layer_id)) {
				
				GateUser user = this.getService().getPosUserService().getPosUserDao().get(pt.getPerId());
				if(!DataUtils.isNullOrEmpty(user.getCard_sn())) {
					PosSimpleUserDto pd = new PosSimpleUserDto();
					PosCardType cardType = this.getService().getPosCardTypeService().getDao().get(user.getStaff_visitor());
					pd.setPerId(pt.getPerId());
					pd.setX(pt.getPerLongitude());
					pd.setY(pt.getPerLatitude());
					pd.setName(user.getName());
					pd.setCardType(cardType.getId());
					pd.setTypeName(cardType.getTypeName());
					pd.setColor(cardType.getColor());
					pos_datas.add(pd);
				}
			}
		}
		if (pos_datas==null || pos_datas.size()<=0) {
			return false;
		}
		
		Response response = Response.set("time", new Date().getTime()-l).ok(pos_datas);
		String message = JSONObject.toJSONString(response);
		// 然后给对应的session 发送有人进入的json 格式的message
		this.sendUser(message);
		return true;
	}

	/**
	 * 向指定用户发送消息
	 * 
	 * @param msg
	 */
	public static void sendUser(String msg) {
		UserPosServer c = null;
		try {
			c = (UserPosServer) area_session.get(layer_id);
			c.session.getBasicRemote().sendText(msg);
//			area_session.remove(c);
//			c.session.close();
		} catch (Exception e) {
			try {
				area_session.remove(c);
			} catch (Exception e2) {
			}

			try {
				c.session.close();
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				
			}

		}
	}

	@OnMessage
	public void message(String message, Session session) {
		// 如果有客户端发送了连接信息过来则保持session
		if (message.contains("open")) {
			// 切割消息 获取 area
			layer_id = message.substring(5);
			System.out.println("客户端初始化连接要求获取 图层:" + layer_id);
			area_session.put(layer_id, this);
			area_sessionid.put(layer_id, session.getId());

			List<PosSimpleUserDto> res = this.getService().getPosTrajectoryService().getAllUser(layer_id);
			if(res!=null && res.size()>0) {
			
				Response response = Response.OK();
				response.setData(res);
				String remessage = JSONObject.toJSONString(response);

				try {
					session.getBasicRemote().sendText(remessage);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		if (message.contains("switcharea_")) {
			// 通过 session 找到对应的 area
			layer_id = message.substring(11);
			System.out.println("客户端切换的分图层:" + layer_id);
			String old_layer_id = "";
			String sessionid = session.getId();
			for (Map.Entry entry : area_sessionid.entrySet()) {
				if (sessionid.equals(entry.getValue()))
					old_layer_id= entry.getKey().toString();
			}
			if (!StringUtils.isEmpty(old_layer_id)) {
				area_sessionid.remove(old_layer_id);
				area_session.remove(old_layer_id);
			}

			area_session.put(layer_id, this);
			area_sessionid.put(layer_id, session.getId());
//			List<PosSimpleUserDto> res = this.getService().getPosTrajectoryService().getAllUser(layer_id);
//			if(res!=null && res.size()>0) {
//			
//				Response response = Response.OK();
//				response.setData(res);
//				String remessage = JSONObject.toJSONString(response);
//
//				try {
//					session.getBasicRemote().sendText(remessage);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//			}
		}

		//
		System.out.println("客户端发送数据 -> " + message);

		
	}

	// @Message
	public void onsend(Session session, String msg) {
		try {
			session.getBasicRemote().sendText("client" + session.getId() + "say:" + msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@OnClose
	public void close() {
		System.out.println("有客户端关闭了连接");
	}

}
