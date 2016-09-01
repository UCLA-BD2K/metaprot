package org.bd2k.metaprot.Scheduler;

import org.bd2k.metaprot.model.TaskInfo;
import org.bd2k.metaprot.util.Globals;

import java.util.*;

/**
 * Schedules incoming tasks to existing R servers
 *
 * Created by Abineet on 8/31/2016.
 */
public class TaskScheduler {
    private class QueueManager{
        public LinkedList<TaskInfo> taskQueue = new LinkedList<TaskInfo>();
        public double currSize;
        public int port;

        public QueueManager(int port) {
            this.port = port;
        }
    }

    private ArrayList<QueueManager> queues = new ArrayList<>();

    /**
     * Generates queues for the number of ports available, defined by globals.
     */
    public TaskScheduler() {
        Integer[] ports = Globals.getPorts();
        for(int i = 0; i < ports.length; i++){
            queues.add(new QueueManager(ports[i]));
        }
    }

    private static TaskScheduler taskScheduler = null;

    /**
     * Returns instance of master task scheduler
     *
     * @return
     */
    public TaskScheduler getInstance(){
        if(taskScheduler == null){
            taskScheduler = new TaskScheduler();
        }

        return taskScheduler;
    }

    /**
     * Manages tasks scheduled for different ports and assigns port to incoming tasks.
     *
     * @param task - the incoming task information
     * @return
     */
    public int scheduleTask(TaskInfo task){
        QueueManager selectedQueue = queues.get(0);
        selectedQueue.taskQueue.add(task);
        selectedQueue.currSize += task.getFileSize();
        int portToReturn = selectedQueue.port;

        //Sort the arraylist on basis of which which has least total size of tasks currently scheduled.
        Collections.sort(queues, new Comparator<QueueManager>() {
            @Override
            public int compare(QueueManager o1, QueueManager o2) {
                if(o1.currSize > o2.currSize)
                    return 1;
                else if(o1.currSize < o2.currSize)
                    return -1;
                else
                    return 0;
            }
        });

        return portToReturn;
    }

    /**
     * Pops of the task at the top of the queue for the queried port.
     * Call to this function indicates that the task at the top of the queue has completed processing.
     *
     * @param port - Port at which the top task has been completed.
     */
    public void endTask(int port){
        for(QueueManager i : queues){
            if(i.port == port){
                TaskInfo temp = i.taskQueue.peekFirst();
                i.currSize -= temp.getFileSize();
                i.taskQueue.removeFirst();
                break;
            }
        }
    }
}
