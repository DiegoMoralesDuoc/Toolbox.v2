import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listalluser } from './listalluser';

describe('Listalluser', () => {
  let component: Listalluser;
  let fixture: ComponentFixture<Listalluser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listalluser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listalluser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
