<template>
  <div class="main">
    <div class="header-title">
      <span>求职 > 校招日历</span>
      <div>
        <el-button type="primary" size="small" @click="addCalendarData" v-if="!hasLogin">添加日历</el-button>
        <el-button type="" size="small" @click="myCalendarData" v-if="hasLogin && !isViewAll && accountType === 'student'">我添加的日历</el-button>
        <el-button type="" size="small" @click="myCalendarData" v-if="hasLogin && isViewAll && accountType === 'student'">查看全部日历</el-button>
        <el-button type="primary" size="small" @click="addCalendarData" v-if="accountType === 'student'">添加日历</el-button>
        <el-button type="primary" size="small" @click="addCalendarData" v-if="accountType === 'company'">发布日历</el-button>
      </div>
    </div>
    <div class="calendar">
      <el-calendar v-model="value" class="calendar-content">
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <!--自定义内容-->
          <div>
            <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
            <div v-for="(item, index) in calendarData" :key="index">
              <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                  <el-tooltip class="item" effect="dark" :content="item.things" placement="right">
                    <div class="is-selected">{{item.things}}</div>
                  </el-tooltip>
                </div>
                <div v-else></div>
              </div>
              <div v-else></div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <div class="dialog-content" v-if="accountType === 'student'">
      <el-dialog
        :title="accountType === 'student' ? '添加笔试日历': '发布笔试日历'"
        :visible.sync="addDialogVisible"
        width="40%">
        <div class="form-content">
          <el-form ref="form" :model="addCalendarForm" label-width="80px">
            <el-form-item label="笔试名称">
              <el-input v-model="addCalendarForm.title"></el-input>
            </el-form-item>
            <el-form-item label="笔试时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="addCalendarForm.calendarDate" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center; color: #DCDFE6">—</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="addCalendarForm.calendarTime" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'WriteCalendar',
  data () {
    return {
      calendarData: [],
      value: new Date(),
      addCalendarForm: {
        title: '',
        calendarDate: '',
        calendarTime: ''
      },
      addDialogVisible: false,
      isViewAll: false
    }
  },
  computed: {
    ...mapState({
      companyInfo: state => state.company.companyList,
      studentInfo: state => state.student.studentList,
      calendarList: state => state.calendar.calendarList || [],
      account: state => state.account
    }),
    ...mapGetters(['hasLogin', 'accountType'])
  },
  watch: {
    calendarList () {
      this.calendarData = this.calendarList
    }
  },
  mounted () {
    let params = {
      companyId: this.companyInfo ? this.companyInfo.companyId : '',
      studentId: this.studentInfo ? this.studentInfo.studentId : ''
    }
    setTimeout(() => {
      console.log(8888, params)
      this.fetchCalendarList(params)
    }, 1000)
  },
  methods: {
    ...mapActions([
      'fetchCalendarList',
      'updateCalendarList'
    ]),
    onSubmit () {
      const TIME_FORMAT = 'MM-DD' // YY-MM-DD
      const HOUR_FORMAT = 'HH:mm' // HH:mm:ss
      let formatMonths = moment(this.addCalendarForm.calendarDate).format(TIME_FORMAT)
      let formatHour = moment(this.addCalendarForm.calendarTime).format(HOUR_FORMAT)
      let data = {
        companyId: this.companyInfo ? this.companyInfo.companyId : '',
        studentId: this.studentInfo ? this.studentInfo.studentId : '',
        months: formatMonths.split('-')[0],
        days: formatMonths.split('-')[1],
        things: `${formatHour} ${this.addCalendarForm.title}`
      }
      this.updateCalendarList(data).then(() => {
        this.fetchLastCalendarList()
        if (this.accountType === 'student') {
          this.$message({
            message: '添加笔试日历成功~',
            type: 'success'
          })
        } else {
          this.$message({
            message: '发布笔试日历成功~',
            type: 'success'
          })
        }
      })
      this.addDialogVisible = false
    },
    addCalendarData () {
      if (!this.account.token) {
        this.$message.error('请先登录，才能添加哦~')
        return this.$router.replace({
          path: '/login'
        })
      }
      this.addDialogVisible = true
    },
    fetchLastCalendarList () {
      let params = {
        companyId: this.companyInfo ? this.companyInfo.companyId : '',
        studentId: this.studentInfo ? this.studentInfo.studentId : ''
      }
      this.fetchCalendarList(params)
    },
    myCalendarData () {
      // 只查看自己发布的日历
      if (!this.isViewAll) {
        this.fetchLastCalendarList()
        this.isViewAll = true
      } else {
        this.fetchLastCalendarList()
        this.isViewAll = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-top: 61px;
  .header-title {
    margin-left: 204px;
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    width: 940px;
  }
  .calendar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .calendar-content {
      width: 900px;
      padding: 20px;
    }
  }
}

.is-selected {
  font-size: 13px;
  color: #2f84cc;
}

.is-selected:hover {
  background: #eeeeee;
}

</style>
