import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Users } from '../users.model';
import { UsersService } from '../users.service';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  id!: number;
  disableID = true;
  editMode = false;
  userForm!: FormGroup;

  get coursesControls() {
    // get controls()
    // buraya dikkat et
    return (<FormArray>this.userForm.get('userCoursesFormArray')).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  onSubmit() {
    if (this.editMode) {
      this.usersService.updateUserData(this.id, this.userForm.value);
    } else {
      if (
        this.usersService
          .getAllTableParameters()
          .nonFilteredUsersTableData.find(
            (user: any) => user.userID === this.userForm.value.userID
          )
      ) {
        alert('User already exists');
      } else {
        this.usersService.addUser(this.userForm.value);
        this.onCancel();
      }
    }
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
  private initForm() {
    let userID;
    let userName = '';
    let userStatus = '';
    let userAge!: number;
    let userJob = '';
    let userFormCourses = new FormArray([]);

    if (this.editMode) {
      const user = this.usersService.getUser(this.id);
      userID = user.userID;
      userName = user.userName;
      userStatus = user.userStatus;
      userAge = user.userAge;
      userJob = user.userJob;
      if (user) {
        for (let course of user.userCourses) {
          userFormCourses.push(
            new FormGroup({
              courseName: new FormControl(
                course.courseName,
                Validators.required
              ),
              measuredAT: new FormControl(course.measuredAT, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
              completedAT: new FormControl(
                course.completedAT,
                Validators.required
              ),
            })
          );
        }
      }
    } else {
      this.disableID = false;
    }

    this.userForm = new FormGroup({
      userID: new FormControl(userID, Validators.required),
      userName: new FormControl(userName, Validators.required),
      userStatus: new FormControl(userStatus, Validators.required),
      userAge: new FormControl(userAge, Validators.required),
      userJob: new FormControl(userJob, Validators.required),
      userCoursesFormArray: userFormCourses,
    });
  }

  onDeleteCourse(index: number) {
    (<FormArray>this.userForm.get('userCoursesFormArray')).removeAt(index);
    this.usersService
      .getAllTableParameters()
      .nonFilteredUsersTableData.find((user: Users) => user.userID === this.id)
      .userCourses.splice(index, 1);
  }

  onAddCourse() {
    (<FormArray>this.userForm.get('userCoursesFormArray')).push(
      new FormGroup({
        courseName: new FormControl(null, Validators.required),
        measuredAT: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
        completedAT: new FormControl(null, Validators.required),
      })
    );
  }
}
