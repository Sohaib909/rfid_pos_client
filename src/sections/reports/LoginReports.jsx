import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { format } from "date-fns"
import DownloadIcon from "@mui/icons-material/Download"
import axiosInstance from "../../utils/axiosInstance"
import DatePicker from "../../utils/datePicker"

const LoginReports = () => {
  const user = useSelector((state) => state.auth.user)
  const [loginRecords, setLoginRecords] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [summary, setSummary] = useState([])
  const [dateFilter, setDateFilter] = useState("7")
  const [selectedDate, setSelectedDate] = useState("")
  const [dailyReport, setDailyReport] = useState(false)

  const fetchLoginRecords = async () => {
    try {
      const params = {
        storeId: user.store.storeId,
        dateFilter,
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
      }

      const response = await axiosInstance.get(`/api/login-reports/store/${user.store.storeId}`, { params })
      setLoginRecords(response.data)
    } catch (error) {
      console.error("Error fetching login records:", error)
    }
  }

  const fetchSummary = async () => {
    try {
      const params = { storeId: user.store.storeId }
      const response = await axiosInstance.get("/api/login-reports/summary", { params })
      setSummary(response.data)
    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }

  useEffect(() => {
    if (user?.store?.storeId) {
      fetchLoginRecords()
      fetchSummary()
    }
  }, [dateFilter, selectedDate, user?.store?.storeId])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDateFilterChange = (event) => {
    const value = event.target.value
    setDateFilter(value)
    setSelectedDate(null)
    setDailyReport(value === "Daily Reports")
  }

  const handleDailyReportChange = (date) => {
    if (date) {
      const timeZoneOffset = date.getTimezoneOffset()
      date.setMinutes(Math.abs(timeZoneOffset))
      setSelectedDate(date)
    }
    setDailyReport(false)
  }

  const handleDownloadExcel = async () => {
    try {
      const params = {
        storeId: user.store.storeId,
        dateFilter,
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
      }

      const response = await axiosInstance.get(`/api/login-reports/download/${user.store.storeId}`, {
        params,
        responseType: "blob",
      })

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `login_report_${format(new Date(), "yyyy-MM-dd")}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  if (!user?.store?.storeId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Login Reports
      </Typography>

      {/* Duration Filter and Download Button */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Duration</InputLabel>
            <Select value={dateFilter} onChange={handleDateFilterChange} label="Duration">
              <MenuItem value="7">7 Days</MenuItem>
              <MenuItem value="15">15 Days</MenuItem>
              <MenuItem value="30">30 Days</MenuItem>
              <MenuItem value="Current">Current</MenuItem>
              <MenuItem value="Daily Reports">Daily Reports</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadExcel}
            fullWidth
          >
            Download Excel
          </Button>
        </Grid>
      </Grid>

      {/* Daily Report Date Picker */}
      {dailyReport && (
        <Box mb={3}>
          <Typography variant="h6">Select Date for Daily Report</Typography>
          <DatePicker onDateChange={handleDailyReportChange} date={selectedDate} />
        </Box>
      )}

      {/* Selected Date Display */}
      {selectedDate && (
        <Box mb={3}>
          <Typography variant="body1" mt={2}>
            Selected Date: {selectedDate.toLocaleDateString()}
          </Typography>
          <Button onClick={() => setDailyReport(true)}>Change Date</Button>
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Last 30 Days Summary</Typography>
            <Typography variant="body1">
              Total Unique Users: {summary.reduce((acc, day) => acc + day.uniqueUsers, 0)}
            </Typography>
            <Typography variant="body1">
              Total Logins: {summary.reduce((acc, day) => acc + day.totalLogins, 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Login Records Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Login Time</TableCell>
                <TableCell>Logout Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                <TableRow key={record._id} sx={!record.logoutTime ? { backgroundColor: "#e8f5e9" } : {}}>
                  <TableCell>
                    {record.user.firstName} {record.user.lastName}
                  </TableCell>
                  <TableCell>{record.user.employeeId}</TableCell>
                  <TableCell>{format(new Date(record.loginTime), "PPpp")}</TableCell>
                  <TableCell>{record.logoutTime ? format(new Date(record.logoutTime), "PPpp") : "-"}</TableCell>
                  <TableCell>
                    {record.logoutTime
                      ? (() => {
                          const loginTime = new Date(record.loginTime)
                          const logoutTime = new Date(record.logoutTime)
                          const durationInMinutes = Math.floor((logoutTime - loginTime) / (1000 * 60))
                          return durationInMinutes >= 60
                            ? `${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60}m`
                            : `${durationInMinutes}m`
                        })()
                      : "-"}
                  </TableCell>
                  <TableCell>{record.logoutTime ? "Completed" : "Active"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={loginRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  )
}

export default LoginReports
