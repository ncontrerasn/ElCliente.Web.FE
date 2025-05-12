import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirMetodoNotificacionComponent } from './elegir-metodo-notificacion.component';

describe('ElegirMetodoNotificacionComponent', () => {
  let component: ElegirMetodoNotificacionComponent;
  let fixture: ComponentFixture<ElegirMetodoNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElegirMetodoNotificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirMetodoNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
