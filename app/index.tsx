import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Employee = {
  id: number;
  employee_name: string;
  employee_age: string | number;
  employee_salary: string | number;
};

type ApiResponse = {
  status: string;
  data: Employee[];
  message: string;
};

export default function EmployeeListScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("https://dummy.restapiexample.com/api/v1/employees");
      const json: ApiResponse = await response.json();
      setEmployees(json.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getBackgroundColor = (age: string | number): string => {
    const ageNum = typeof age === "string" ? parseInt(age, 10) : age;
    if (ageNum >= 50) return "#90EE90";
    if (ageNum >= 40) return "#FFFF00";
    if (ageNum >= 30) return "#0066FF";
    if (ageNum >= 20) return "#FF0000";
    return "#CCCCCC";
  };

  const filteredEmployees = employees.filter((emp) => {
    const salary =
      typeof emp.employee_salary === "string"
        ? parseInt(emp.employee_salary, 10)
        : emp.employee_salary;
    return salary > 500000;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading employees...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load data</Text>
        <Pressable style={styles.reloadButton} onPress={fetchEmployees}>
          <Text style={styles.buttonText}>Reload</Text>
        </Pressable>
      </View>
    );
  }

  if (filteredEmployees.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No employees found</Text>
        <Pressable style={styles.reloadButton} onPress={fetchEmployees}>
          <Text style={styles.buttonText}>Reload</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.reloadButton} onPress={fetchEmployees}>
        <Text style={styles.buttonText}>Reload</Text>
      </Pressable>
      <FlatList<Employee>
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const backgroundColor = getBackgroundColor(item.employee_age);
          const salary =
            typeof item.employee_salary === "string"
              ? parseInt(item.employee_salary, 10)
              : item.employee_salary;

          return (
            <View style={[styles.card, { backgroundColor }]}>
              <Text style={styles.name}>Name: {item.employee_name}</Text>
              <Text style={styles.detail}>Age: {item.employee_age}</Text>
              <Text style={styles.detail}>
                Salary: ${salary.toLocaleString()}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  reloadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
