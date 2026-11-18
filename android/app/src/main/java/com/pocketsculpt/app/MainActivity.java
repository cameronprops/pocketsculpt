package com.pocketsculpt.app;

import android.app.Activity;
import android.os.Bundle;
import android.opengl.GLSurfaceView;
import android.opengl.GLES20;
import android.opengl.Matrix;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.graphics.Color;
import android.view.Gravity;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

public class MainActivity extends Activity {
  private CreatureView view;
  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    FrameLayout root = new FrameLayout(this);
    view = new CreatureView(this);
    root.addView(view);
    TextView label = new TextView(this);
    label.setText("POCKET SCULPT  •  ANDROID 0.1\nDrag to orbit  •  Pinch to zoom");
    label.setTextColor(Color.WHITE); label.setTextSize(14);
    label.setPadding(26,32,20,20);
    root.addView(label, new FrameLayout.LayoutParams(-2,-2,Gravity.TOP|Gravity.LEFT));
    setContentView(root);
  }
  @Override protected void onPause(){super.onPause();view.onPause();}
  @Override protected void onResume(){super.onResume();view.onResume();}
  static class CreatureView extends GLSurfaceView {
    final CreatureRenderer renderer = new CreatureRenderer();
    float lastX,lastY,lastDistance; boolean pinching;
    CreatureView(Activity a){super(a);setEGLContextClientVersion(2);setRenderer(renderer);setRenderMode(RENDERMODE_CONTINUOUSLY);}
    @Override public boolean onTouchEvent(MotionEvent e){
      if(e.getPointerCount()>=2){
        float dx=e.getX(0)-e.getX(1),dy=e.getY(0)-e.getY(1);
        float d=(float)Math.hypot(dx,dy);
        if(pinching&&lastDistance>0)renderer.distance=Math.max(3,Math.min(14,renderer.distance*lastDistance/d));
        lastDistance=d;pinching=true;return true;
      }
      if(e.getActionMasked()==MotionEvent.ACTION_DOWN){lastX=e.getX();lastY=e.getY();pinching=false;}
      else if(e.getActionMasked()==MotionEvent.ACTION_MOVE){if(!pinching){renderer.yaw+=(e.getX()-lastX)*.008f;renderer.pitch=Math.max(-1.4f,Math.min(1.4f,renderer.pitch+(e.getY()-lastY)*.008f));}lastX=e.getX();lastY=e.getY();}
      else if(e.getActionMasked()==MotionEvent.ACTION_UP){pinching=false;lastDistance=0;}
      return true;
    }
  }
  static class CreatureRenderer implements GLSurfaceView.Renderer {
    volatile float yaw=.3f,pitch=.1f,distance=6.5f;
    int program,position,normal,mvpLoc,modelLoc,lightLoc; FloatBuffer geometry; int count;
    float[] proj=new float[16],view=new float[16],rotation=new float[16],model=new float[16],mvp=new float[16],tmp=new float[16];
    final String vs="attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uMVP; uniform mat4 uModel; varying float shade; void main(){vec3 n=normalize((uModel*vec4(aNormal,0.0)).xyz);shade=0.38+0.62*max(dot(n,normalize(vec3(0.5,0.8,1.0))),0.0);gl_Position=uMVP*vec4(aPosition,1.0);}";
    final String fs="precision mediump float; varying float shade; void main(){gl_FragColor=vec4(vec3(0.47,0.70,0.82)*shade,1.0);}";
    int shader(int type,String src){int s=GLES20.glCreateShader(type);GLES20.glShaderSource(s,src);GLES20.glCompileShader(s);return s;}
    @Override public void onSurfaceCreated(javax.microedition.khronos.opengles.GL10 gl,javax.microedition.khronos.egl.EGLConfig config){
      GLES20.glClearColor(.055f,.078f,.105f,1);GLES20.glEnable(GLES20.GL_DEPTH_TEST);
      program=GLES20.glCreateProgram();GLES20.glAttachShader(program,shader(GLES20.GL_VERTEX_SHADER,vs));GLES20.glAttachShader(program,shader(GLES20.GL_FRAGMENT_SHADER,fs));GLES20.glLinkProgram(program);
      position=GLES20.glGetAttribLocation(program,"aPosition");normal=GLES20.glGetAttribLocation(program,"aNormal");mvpLoc=GLES20.glGetUniformLocation(program,"uMVP");modelLoc=GLES20.glGetUniformLocation(program,"uModel");
      MeshBuilder b=new MeshBuilder();
      float[][] joints={{0,0,0,.38f},{0,.7f,0,.31f},{0,1.23f,0,.32f},{-.65f,.7f,0,.19f},{-1.12f,.3f,0,.14f},{.65f,.7f,0,.19f},{1.12f,.3f,0,.14f},{-.35f,-.68f,0,.25f},{-.43f,-1.36f,0,.15f},{.35f,-.68f,0,.25f},{.43f,-1.36f,0,.15f}};
      int[][] edges={{0,1},{1,2},{1,3},{3,4},{1,5},{5,6},{0,7},{7,8},{0,9},{9,10}};
      for(float[] j:joints)b.sphere(j[0],j[1],j[2],j[3]);
      for(int[] edge:edges)b.bone(joints[edge[0]],joints[edge[1]]);
      geometry=ByteBuffer.allocateDirect(b.size*4).order(ByteOrder.nativeOrder()).asFloatBuffer();geometry.put(b.data,0,b.size).position(0);count=b.size/6;
    }
    @Override public void onSurfaceChanged(javax.microedition.khronos.opengles.GL10 gl,int w,int h){GLES20.glViewport(0,0,w,h);Matrix.perspectiveM(proj,0,45f,(float)w/Math.max(h,1),.1f,100);}
    @Override public void onDrawFrame(javax.microedition.khronos.opengles.GL10 gl){
      GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT|GLES20.GL_DEPTH_BUFFER_BIT);
      Matrix.setLookAtM(view,0,0,0,distance,0,0,0,0,1,0);Matrix.setIdentityM(rotation,0);
      Matrix.rotateM(rotation,0,pitch*57.29578f,1,0,0);Matrix.rotateM(rotation,0,yaw*57.29578f,0,1,0);
      Matrix.multiplyMM(tmp,0,view,0,rotation,0);Matrix.multiplyMM(mvp,0,proj,0,tmp,0);
      GLES20.glUseProgram(program);GLES20.glUniformMatrix4fv(mvpLoc,1,false,mvp,0);GLES20.glUniformMatrix4fv(modelLoc,1,false,rotation,0);
      geometry.position(0);GLES20.glVertexAttribPointer(position,3,GLES20.GL_FLOAT,false,24,geometry);GLES20.glEnableVertexAttribArray(position);
      geometry.position(3);GLES20.glVertexAttribPointer(normal,3,GLES20.GL_FLOAT,false,24,geometry);GLES20.glEnableVertexAttribArray(normal);
      GLES20.glDrawArrays(GLES20.GL_TRIANGLES,0,count);
    }
  }
  static class MeshBuilder {
    float[] data=new float[400000];int size=0;
    void v(float x,float y,float z,float nx,float ny,float nz){if(size+6>data.length)data=java.util.Arrays.copyOf(data,data.length*2);data[size++]=x;data[size++]=y;data[size++]=z;data[size++]=nx;data[size++]=ny;data[size++]=nz;}
    void tri(float[] a,float[] b,float[] c){v(a[0],a[1],a[2],a[3],a[4],a[5]);v(b[0],b[1],b[2],b[3],b[4],b[5]);v(c[0],c[1],c[2],c[3],c[4],c[5]);}
    float[] point(float x,float y,float z,float r,float t,float p){float nx=(float)(Math.sin(t)*Math.cos(p)),ny=(float)Math.cos(t),nz=(float)(Math.sin(t)*Math.sin(p));return new float[]{x+r*nx,y+r*ny,z+r*nz,nx,ny,nz};}
    void sphere(float x,float y,float z,float r){int lat=16,lon=24;for(int i=0;i<lat;i++)for(int j=0;j<lon;j++){float t0=(float)Math.PI*i/lat,t1=(float)Math.PI*(i+1)/lat,p0=(float)(2*Math.PI*j/lon),p1=(float)(2*Math.PI*(j+1)/lon);float[] a=point(x,y,z,r,t0,p0),b=point(x,y,z,r,t1,p0),c=point(x,y,z,r,t1,p1),d=point(x,y,z,r,t0,p1);tri(a,b,c);tri(a,c,d);}}
    void bone(float[] a,float[] b){float dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=(float)Math.sqrt(dx*dx+dy*dy+dz*dz);if(len<.0001f)return;dx/=len;dy/=len;dz/=len;float ux=-dy,uy=dx,uz=0;if(Math.abs(dz)>.9f){ux=1;uy=0;uz=0;}float ulen=(float)Math.sqrt(ux*ux+uy*uy+uz*uz);ux/=ulen;uy/=ulen;uz/=ulen;float vx=dy*uz-dz*uy,vy=dz*ux-dx*uz,vz=dx*uy-dy*ux;int segments=24;for(int j=0;j<segments;j++){float t0=(float)(2*Math.PI*j/segments),t1=(float)(2*Math.PI*(j+1)/segments);float c0=(float)Math.cos(t0),s0=(float)Math.sin(t0),c1=(float)Math.cos(t1),s1=(float)Math.sin(t1);float[] p=new float[4][];for(int k=0;k<4;k++){float[] n=(k<2)?a:b;float co=(k==0||k==3)?c0:c1,si=(k==0||k==3)?s0:s1;float nx=ux*co+vx*si,ny=uy*co+vy*si,nz=uz*co+vz*si;p[k]=new float[]{n[0]+n[3]*nx,n[1]+n[3]*ny,n[2]+n[3]*nz,nx,ny,nz};}tri(p[0],p[1],p[2]);tri(p[0],p[2],p[3]);}}
  }
}
