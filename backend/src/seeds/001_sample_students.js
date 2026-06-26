exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('marks').del();
  await knex('students').del();

  // Inserts seed entries
  const students = await knex('students').insert([
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '9876543210', enrollment_date: '2024-01-15' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '9876543211', enrollment_date: '2024-01-20' },
    { name: 'Charlie Brown', email: 'charlie@example.com', phone: '9876543212', enrollment_date: '2024-02-01' },
    { name: 'Diana Prince', email: 'diana@example.com', phone: '9876543213', enrollment_date: '2024-02-10' },
    { name: 'Eve Wilson', email: 'eve@example.com', phone: '9876543214', enrollment_date: '2024-02-15' },
    { name: 'Frank Miller', email: 'frank@example.com', phone: '9876543215', enrollment_date: '2024-03-01' },
    { name: 'Grace Lee', email: 'grace@example.com', phone: '9876543216', enrollment_date: '2024-03-05' },
    { name: 'Henry Davis', email: 'henry@example.com', phone: '9876543217', enrollment_date: '2024-03-10' },
    { name: 'Ivy Taylor', email: 'ivy@example.com', phone: '9876543218', enrollment_date: '2024-03-15' },
    { name: 'Jack Anderson', email: 'jack@example.com', phone: '9876543219', enrollment_date: '2024-03-20' },
  ]);

  // Insert marks for each student
  await knex('marks').insert([
    // Alice's marks
    { student_id: 1, subject: 'Mathematics', score: 92.5, exam_date: '2024-04-10' },
    { student_id: 1, subject: 'English', score: 88.0, exam_date: '2024-04-12' },
    { student_id: 1, subject: 'Science', score: 95.0, exam_date: '2024-04-15' },

    // Bob's marks
    { student_id: 2, subject: 'Mathematics', score: 78.5, exam_date: '2024-04-10' },
    { student_id: 2, subject: 'English', score: 82.0, exam_date: '2024-04-12' },
    { student_id: 2, subject: 'Science', score: 80.5, exam_date: '2024-04-15' },

    // Charlie's marks
    { student_id: 3, subject: 'Mathematics', score: 85.0, exam_date: '2024-04-10' },
    { student_id: 3, subject: 'English', score: 90.5, exam_date: '2024-04-12' },
    { student_id: 3, subject: 'Science', score: 87.0, exam_date: '2024-04-15' },

    // Diana's marks
    { student_id: 4, subject: 'Mathematics', score: 94.0, exam_date: '2024-04-10' },
    { student_id: 4, subject: 'English', score: 91.5, exam_date: '2024-04-12' },

    // Eve's marks
    { student_id: 5, subject: 'Mathematics', score: 76.5, exam_date: '2024-04-10' },

    // Frank's marks
    { student_id: 6, subject: 'English', score: 88.5, exam_date: '2024-04-12' },
    { student_id: 6, subject: 'Science', score: 89.0, exam_date: '2024-04-15' },

    // Grace's marks
    { student_id: 7, subject: 'Mathematics', score: 91.0, exam_date: '2024-04-10' },
    { student_id: 7, subject: 'Science', score: 93.5, exam_date: '2024-04-15' },

    // Henry's marks
    { student_id: 8, subject: 'English', score: 84.0, exam_date: '2024-04-12' },

    // Ivy's marks
    { student_id: 9, subject: 'Science', score: 86.5, exam_date: '2024-04-15' },

    // Jack's marks
    { student_id: 10, subject: 'Mathematics', score: 79.5, exam_date: '2024-04-10' },
    { student_id: 10, subject: 'English', score: 81.0, exam_date: '2024-04-12' },
    { student_id: 10, subject: 'Science', score: 82.5, exam_date: '2024-04-15' },
  ]);
};
