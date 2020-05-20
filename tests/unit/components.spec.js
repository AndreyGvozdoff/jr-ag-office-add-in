import { mount } from '@vue/test-utils'
import InputNumber from '@/components/input-number.vue'
import InputUrl from '@/components/input-url.vue'
import InputPassword from '@/components/input-password.vue'

describe('input-url.vue', () => {
  let prefix = 'https://'
  let wrapper = mount(InputUrl,{
    propsData: { prefix }
  });

  it('renders props.prefix when passed', () => {
    expect(wrapper.text()).toMatch(prefix)
  });
  it('has a input', () => {
    expect(wrapper.contains('input')).toBe(true)
  });
  it('onchange input value should return this value', () => {
    wrapper.setProps({ value: prefix })
    expect(wrapper.vm.value).toBe(prefix)
  });
})

describe('input-number.vue', () => {
  let currentValue = NaN
  let controls = true
  let wrapper = mount(InputNumber,{
    propsData: { currentValue, controls }
  });

  it('click on plus (+) button should increase current value', () => {
    expect(wrapper.vm.currentValue).toBe(currentValue)
    const button = wrapper.find('.number-input__button--plus')
    button.trigger('click')
    expect(wrapper.vm.currentValue).toBe(1)
  });
  it('click on minus (-) button should decrease current value', () => {
    wrapper.vm.currentValue = 10
    let button = wrapper.find('.number-input__button--minus')
    button.trigger('click')
    expect(wrapper.vm.currentValue).toBe(9)
  });
  it('has a input', () => {
    expect(wrapper.contains('input')).toBe(true)
  });
})

describe('input-password.vue', () => {
  let inputType = 'password';
  let wrapper = mount(InputPassword,{
    propsData: { inputType }
  });

  it('has a input', () => {
    expect(wrapper.contains('input')).toBe(true)
  });
  it('show-hide typed password onclick icon', () => {
    wrapper.setData({ password: 'test'+inputType  });
    expect(wrapper.vm.password).toBe('test'+inputType )
    let icon = wrapper.find('.show-hide-password-icon')
    icon.trigger('click')
    expect(wrapper.vm.inputType).toBe('text')
  });
  it('hide icon on desktop', () => {
    wrapper.setProps({ showIcon: 'desktop' })
    expect(wrapper.vm.showIcon).toBe('desktop')
    expect(wrapper.find('.show-hide-password-icon').exists()).toBe(true)
  });
})
