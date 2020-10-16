<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="一级分类">
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="changeFirst"
          >
            <el-option label="请选择" value="shanghai" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" placeholder="请选择">
            <el-option label="请选择" value="shanghai" disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        
        <el-form-item label="商品价格">
          <!-- <template slot-scope="scope">
              <span>{{scope.row.price|filterPrice}}</span>
          </template> -->
          <el-input v-model="form.price" @blur="form.price=Number(form.price).toFixed(2)"></el-input>
        </el-form-item>

         <el-form-item label="市场价格">
          <el-input v-model="form.market_price" @blur="form.market_price=Number(form.market_price).toFixed(2)" ></el-input>
         </el-form-item>


        <el-form-item label="图片">    
          <div class="my-upload">
            <h2>+</h2>
            <img class="img" :src="imgUrl" alt="" v-if="imgUrl" />
            <input
              v-if="info.isshow"
              type="file"
              @change="getFile"
              class="my-input"
            />
          </div>
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select
            v-model="form.specsid"
            placeholder="请选择"
            @change="changeSpecs"
          >
            <el-option label="请选择" value="shanghai" disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" placeholder="请选择" multiple>
            <el-option label="请选择" disabled value=""></el-option>
            <el-option
              v-for="item in goodsAttrList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>

        <el-form-item label="商品描述">
          <div v-if="info.isshow" id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import {
  reqGoodsAdd,
  reqGoodsInfo,
  reqGoodsEdit,
  reqCateList,
} from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //   二级分类列表
      secondCateList: [],
      //   图片地址
      imgUrl: "",
      //   商品属性
      goodsAttrList: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateListAction: "cate/reqListAction",
      reqSpecsList: "specs/reqListAction",
      reqListAction: "goods/reqListAction",
      reqTotalAction: "goods/reqTotalAction",
    }),
    opened() {
      //富文本
      this.editor = new E("#editor");
      this.editor.create();
      //编辑器创建完成以后再赋值
      this.editor.txt.html(this.form.description);
    },
    getFile(e) {
      let file = e.target.files[0];
      // console.log(file);
      //   1.大小不超过2M
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件的大小不能超过2M");
        return;
      }
      // 2.验证格式
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      let extname = file.name.slice(file.name.lastIndexOf("."));
      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("格式不正确");
        return;
      }

      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    changeFirst() {
      this.form.second_cateid = "";
      this.getSecondList();
    },
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    changeSpecs() {
      this.form.specsattr = [];
      this.getAttrsArr();
    },
    // 获得商品的属性
    getAttrsArr() {
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      this.goodsAttrList = obj.attrs;
    },
    //取消
    cancel() {
      this.info.isshow = false;
    },
    //弹框消失完成
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //数据重置
    empty() {
      (this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
        status: 1,
      }),
        //   二级分类列表
        (this.secondCateList = []);
      //this.   图片地址
      this.imgUrl = "";
      //this.   商品属性
      this.goodsAttrList = [];
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add() {
      this.form.description = this.editor.txt.html();
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      reqGoodsAdd(data).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqGoodsInfo(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id=id;
          //需要请求一下二级分类的list
          this.getSecondList();
           //图片
          this.imgUrl = this.$imgPre + this.form.img;

            //商品属性从字符串转为 []
          this.form.specsattr = JSON.parse(this.form.specsattr);
            //获取商品属性的数组
          this.getAttrsArr();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      reqGoodsEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqGoodsList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //如果商品一级分类没有请求过，就请求一次
    if (this.cateList.length == 0) {
      this.reqCateListAction();
    }
    //如果没有请求过角色管理的数据，就请求一次，如果请求过了，就不用请求了
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.my-upload h2 {
  text-align: center;
  line-height: 150px;
  font-weight: 400;
}
.my-upload .my-input {
  position: absolute;
  width: 150px;
  height: 150px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>