<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRegister } from '~/composables/auth/useRegister'

const { onSubmit } = useRegister()
</script>

<template>
    <Card class="signup-form">
        <CardHeader>
            <CardTitle class="text-xl sm:text-2xl form-title">{{ $t('auth.signup_title') }}</CardTitle>
            <CardDescription class="text-xs sm:text-sm form-desc">{{ $t('auth.signup_description') }}</CardDescription>
        </CardHeader>
        <form @submit="onSubmit">
            <CardContent class="mb-4 sm:mb-6">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem class="mb-3 sm:mb-4">
                        <FormLabel class="text-sm sm:text-base form-label">{{ $t('auth.name') }}</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" class="text-sm sm:text-base form-input" />
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                    <FormItem class="mb-3 sm:mb-4">
                        <FormLabel class="text-sm sm:text-base form-label">{{ $t('auth.email') }}</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" class="text-sm sm:text-base form-input" />
                        </FormControl>
                        <FormMessage class="text-xs sm:text-sm" />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormItem class="mb-3 sm:mb-4">
                        <FormLabel class="text-sm sm:text-base form-label">{{ $t('auth.password') }}</FormLabel>
                        <FormControl>
                            <Input type="password" autocomplete="on" v-bind="componentField" class="text-sm sm:text-base form-input" />
                        </FormControl>
                        <FormMessage class="text-xs sm:text-sm" />
                    </FormItem>
                </FormField>
            </CardContent>
            <CardFooter>
                <Button type="submit" class="text-xs sm:text-sm form-button">{{ $t('auth.register') }}</Button>
            </CardFooter>
        </form>
    </Card>
</template>

<style scoped>
/* Responsive form styles */
@media (max-width: 640px) {
  .signup-form {
    font-size: 95%;
  }
  
  .form-title {
    font-size: 95%;
  }
  
  .form-desc {
    font-size: 95%;
  }
  
  .form-label {
    font-size: 95%;
  }
  
  .form-input {
    font-size: 95%;
  }
  
  .form-button {
    font-size: 95%;
  }
}

@media (max-width: 480px) {
  .signup-form {
    font-size: 90%;
  }
  
  .form-title {
    font-size: 90%;
  }
  
  .form-desc {
    font-size: 90%;
  }
  
  .form-label {
    font-size: 90%;
  }
  
  .form-input {
    font-size: 90%;
  }
  
  .form-button {
    font-size: 90%;
  }
}
</style>