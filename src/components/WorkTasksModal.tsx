import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Clock, Plus, Filter, ArrowRight } from 'lucide-react';
import { WorkGroup } from '../data/storeData';
import { SmartImage } from './SmartImage';

interface WorkTasksModalProps {
  workGroup: WorkGroup;
  onClose: () => void;
  onToggleTask: (groupId: string, taskId: string) => void;
  onAddTask: (groupId: string, title: string, detail: string, duration: string) => void;
  onFilterProductsByGroup: (groupId: string) => void;
  customImages: Record<string, string>;
  onUploadCustomImage: (key: string, dataUrl: string) => void;
  onResetCustomImage: (key: string) => void;
}

export const WorkTasksModal: React.FC<WorkTasksModalProps> = ({
  workGroup,
  onClose,
  onToggleTask,
  onAddTask,
  onFilterProductsByGroup,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [taskDuration, setTaskDuration] = useState('2 hrs');

  const completedCount = workGroup.smallTasks.filter((t) => t.completed).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(workGroup.id, taskTitle.trim(), taskDetail.trim() || 'Custom studio process checkpoint.', taskDuration);
    setTaskTitle('');
    setTaskDetail('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#FF5722] uppercase tracking-wider">
              WORK GROUP {workGroup.groupNumber}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">Small Task Breakdown</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
              <SmartImage
                src={workGroup.image}
                customKey={`wg-${workGroup.id}`}
                customImages={customImages}
                onUploadCustomImage={onUploadCustomImage}
                onResetCustomImage={onResetCustomImage}
                alt={workGroup.title}
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">{workGroup.title}</h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">{workGroup.summary}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700">
                  {completedCount} of {workGroup.smallTasks.length} tasks completed
                </span>
                <span className="text-zinc-300">|</span>
                <div className="h-1.5 w-24 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#FF5722] rounded-full transition-all"
                    style={{
                      width: `${(completedCount / Math.max(workGroup.smallTasks.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Assigned Small Tasks
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel New Task' : 'Add Small Task'}</span>
            </button>
          </div>

          {/* Inline Add Task Form */}
          {showAddForm && (
            <form onSubmit={handleCreate} className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Small Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron mordant pH testing"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Details / Note</label>
                  <input
                    type="text"
                    placeholder="Specific instruction or recipe notes"
                    value={taskDetail}
                    onChange={(e) => setTaskDetail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-full bg-[#FF5722] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#E64A19] cursor-pointer"
                >
                  Save Small Task
                </button>
              </div>
            </form>
          )}

          {/* List of Small Tasks */}
          <div className="space-y-3">
            {workGroup.smallTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(workGroup.id, task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  task.completed
                    ? 'bg-zinc-50/60 border-zinc-200 text-zinc-400'
                    : 'bg-white border-zinc-200 hover:border-[#FF5722] shadow-xs'
                }`}
              >
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 hover:text-[#FF5722] shrink-0" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider">
                      Task {task.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                      <Clock className="w-3 h-3" />
                      {task.duration}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mt-0.5 ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-900'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{task.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onFilterProductsByGroup(workGroup.id);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Show Products in this Work Group</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#111827] px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
