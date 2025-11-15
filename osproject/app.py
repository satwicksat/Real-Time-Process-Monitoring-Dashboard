from flask import Flask, render_template, jsonify
import psutil
import time
import datetime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/stats")
def get_stats():
    cpu_percent = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory()

    stats = {
        "cpu": cpu_percent,
        "total_mem": round(memory.total / (1024 ** 3), 2),
        "used_mem": round(memory.used / (1024 ** 3), 2),
        "free_mem": round(memory.free / (1024 ** 3), 2),
        "uptime": round(time.time() - psutil.boot_time(), 2)
    }

    return jsonify(stats)

@app.route("/api/processes")
def get_processes():
    process_list = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        process_list.append(proc.info)

    return jsonify(process_list)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
