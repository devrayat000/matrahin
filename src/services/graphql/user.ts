import { unstable_cache } from "next/cache";
import type {
  CreateStudentMutation,
  CreateStudentMutationVariables,
  FindStudentQuery,
  FindStudentQueryVariables,
  GetAccessCodesQuery,
  GetAccessCodesQueryVariables,
  GetStudentsCountQuery,
  PublishStudentMutation,
  PublishStudentMutationVariables,
} from "~/generated/graphql";
import { Student } from "~/lib/types/Student";
import { gql, gqlClient } from "~/lib/utils";

export async function findOrCreateUser(params: Student) {
  try {
    const student = await findStudent(params.email);

    if (!student) {
      await createStudent(params);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error loging in! Please contact support.");
  }
}

const FIND_STUDENT = gql`
  query FindStudent($email: String!) {
    student(where: { email: $email }) {
      id
      name
      email
      phone
      institution
      hscYear
    }
  }
`;

export const findStudent = unstable_cache(
  async (email: string) => {
    console.log("okay");
    const { student } = await gqlClient.request<
      FindStudentQuery,
      FindStudentQueryVariables
    >(FIND_STUDENT, { email });
    console.log("finding...");
    console.log({ student });

    return student;
  },
  ["login", "student"],
  { tags: ["login", "student"] }
);

const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentCreateInput!) {
    createStudent(data: $input) {
      id
    }
  }
`;

const PUBLISH_STUDENT = gql`
  mutation PublishStudent($id: ID!) {
    publishStudent(where: { id: $id }) {
      id
    }
  }
`;

async function createStudent(params: Student) {
  const {
    createStudent: { id },
  } = await gqlClient.request<
    CreateStudentMutation,
    CreateStudentMutationVariables
  >(CREATE_STUDENT, { input: params });
  console.log("creating...");
  console.log(id);

  await gqlClient.request<
    PublishStudentMutation,
    PublishStudentMutationVariables
  >(PUBLISH_STUDENT, { id });
}

const ACCESS_CODE_QUERY = gql`
  query GetAccessCodes {
    accessCodes {
      code
    }
  }
`;

function getAccessCodes() {
  return gqlClient.request<GetAccessCodesQuery, GetAccessCodesQueryVariables>(
    ACCESS_CODE_QUERY
  );
}

export async function verifyProductKey(key: string) {
  const { accessCodes } = await getAccessCodes();
  const isValid = accessCodes.map((c) => c.code).includes(key);
  if (!isValid) {
    throw new Error("Invalid product. Please contact support.");
  }
}

const STUDENTS_COUNT_QUERY = gql`
  query GetStudentsCount {
    studentsConnection {
      aggregate {
        count
      }
    }
  }
`;

export const getStudentsCount = unstable_cache(
  async () => {
    const { studentsConnection } =
      await gqlClient.request<GetStudentsCountQuery>(STUDENTS_COUNT_QUERY);
    return studentsConnection.aggregate.count;
  },
  ["studentsCount", "students"],
  { tags: ["studentsCount", "students"] }
);
